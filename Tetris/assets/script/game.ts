import SingleBlock from "./block";
import Block from "./block";
import BlockS from "./block-S";
import BlockI from "./block-I";
import BlockL from "./block-L";
import BlockLI from "./block-LI";
import BlockSquare from "./block-Sq";
import BlockSI from "./block-SI";
import BlockT from "./block-T";
import Setting from "./settings";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property({ type: [cc.Prefab] })
    blocks: cc.Prefab[] = [];

    @property
    timer: number = 2;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Node)
    NextBlock: cc.Node = null;

    @property(cc.Node)
    HoldBlock: cc.Node = null;

    @property(cc.TextAsset)
    Highscore: cc.TextAsset = null;
    Score: number = 0;

    @property(cc.Node)
    GameOverPopUp: cc.Node = null;

    @property(cc.Label)
    GameOverScore: cc.Label = null;

    @property(cc.Node)
    SoundButton: cc.Node = null;
    @property(cc.Node)
    PauseButton: cc.Node = null;
    @property(cc.Node)
    PausePopUp: cc.Node = null;
    @property(cc.Node)
    ResumeButton: cc.Node = null;
    @property(cc.Node)
    QuitButton: cc.Node = null;

    @property(cc.AudioClip)
    SoundTheme: cc.AudioClip = null;
    @property(cc.AudioClip)
    SoundMove: cc.AudioClip = null;
    @property(cc.AudioClip)
    SoundRotate: cc.AudioClip = null;
    @property(cc.AudioClip)
    SoundScore: cc.AudioClip = null;
    @property(cc.SpriteFrame)
    SoundOnSprite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    SoundOffSprite: cc.SpriteFrame = null;

    private newB: Block = null;
    private countTimer: number = 0;
    private isSwipe: boolean = false;
    private startX: number;
    private startY: number;
    private endX: number;
    private endY: number;
    private curB: cc.Node;
    private count = 0;
    private arr: any;
    private isSpeedUp: boolean = false;
    private next: number = -1;
    private nextNode: cc.Node = null;
    private r = -1;
    private dropNow = false;
    private isGameOver = false;
    private soundState = true;
    private storeTimer: number = this.timer;
    private isDragging: boolean = false;
    private blockSize: number = 16;
    random(): number {
        return Math.floor(Math.random() * Math.floor(this.blocks.length));
    }

    newBlock() {
        this.r = this.random();
        if (this.next == -1) {
            this.curB = cc.instantiate(this.blocks[this.r]);

        } else {
            this.curB = cc.instantiate(this.blocks[this.next]);
            this.r = this.next;
        }
        this.next = this.random();
        this.node.addChild(this.curB);

        switch (this.r) {
            case 0: this.newB = new BlockS; this.cShadow = new BlockS; break;
            case 1: this.newB = new BlockI; this.cShadow = new BlockI; break;
            case 2: this.newB = new BlockL; this.cShadow = new BlockL; break;
            case 3: this.newB = new BlockLI; this.cShadow = new BlockLI; break;
            case 4: this.newB = new BlockSquare; this.cShadow = new BlockSquare; break;
            case 5: this.newB = new BlockSI; this.cShadow = new BlockSI; break;
            case 6: this.newB = new BlockT; this.cShadow = new BlockT; break;

        }
        this.newB.board = this.arr;
        this.newB.node = this.curB;
        this.getShadow();
        if (this.nextNode) this.nextNode.destroy();
        this.addBlockToNext();
        this.canHold = true;
        this.isDragging = false;

        //check game over
        for (let block of this.newB.node.children) {
            let cell = this.newB.getCell(block);
            try {
                if (this.arr[cell[0]][cell[1]]) {
                    this.isGameOver = true;
                    // cc.director.pause();
                    console.log("Game over");
                    this.Highscore.text = this.Score.toString();
                    if (this.isBreakHighScore()) {
                        this.saveHighScore();
                    }
                    this.GameOverPopUp.active = true;
                    this.GameOverPopUp.zIndex = 99;
                    this.node.opacity = 50;
                    this.GameOverScore.string = this.Score.toString();
                    break;
                }
            } catch (e) { };
        }
    }
    addBlockToNext() {
        this.nextNode = cc.instantiate(this.blocks[this.next]);
        this.NextBlock.addChild(this.nextNode);
        this.nextNode.zIndex = 0;
        this.nextNode.setScale(0.8, 0.8);
        //set position for next block
        switch(this.next) {
            //BlockS
            case 0: this.nextNode.setPosition(-this.blockSize, -0.5 * this.blockSize); break;
            //BlockI
            case 1: this.nextNode.setPosition(-this.blockSize * 1.25, 0); break;
            //block L
            case 2:  this.nextNode.setPosition( -this.blockSize * 0.5, -this.blockSize); break;
            //blockLI
            case 3:  this.nextNode.setPosition(-this.blockSize * 0.5, -this.blockSize); break;
            //block Square: 
            case 4:  this.nextNode.setPosition( - this.blockSize * 0.5, (-0.5) * this.blockSize); break;
            //block SI:
            case 5:  this.nextNode.setPosition(-this.blockSize,  0.5 * this.blockSize); break;
            //block T
            case 6:  this.nextNode.setPosition(-this.blockSize, -0.5 * this.blockSize); break;
        }
    }
    addBlockToHold() {
        if (this.holdingBlock) this.holdingBlock.destroy();
        //this.curB.destroy();
        this.holdingBlock = cc.instantiate(this.blocks[this.holdingBlockType]);
        this.HoldBlock.addChild(this.holdingBlock);
        this.holdingBlock.zIndex = 0;
        this.holdingBlock.setScale(0.8, 0.8);
        //set position for next block
        switch(this.holdingBlockType) {
            //BlockS
            case 0: this.holdingBlock.setPosition((-0.5) * this.blockSize, (-0.5) * this.blockSize); break;
            //BlockI
            case 1: this.holdingBlock.setPosition(this.blockSize * (-1.25), 0); break;
            //block L
            case 2:  this.holdingBlock.setPosition(this.blockSize * (-0.25) , -this.blockSize); break;
            //blockLI
            case 3:  this.holdingBlock.setPosition(this.blockSize * (-0.25), -this.blockSize); break;
            //block Square: 
            case 4:  this.holdingBlock.setPosition( -0.5 * this.blockSize, (-0.5) * this.blockSize); break;
            //block SI:
            case 5:  this.holdingBlock.setPosition(this.blockSize * (-0.75),  0.5 * this.blockSize); break;
            //block T
            case 6:  this.holdingBlock.setPosition(this.blockSize * -0.75, -0.25 * this.blockSize); break;
        }
    }
    initBoard() {
        this.arr = new Array(24);
        for (let i = 0; i < 24; i++) {
            this.arr[i] = new Array<cc.Node>(10);
        }
    }
    private canHold: boolean = true;
    private holdingBlockType: number = -1;
    private holdingBlock: cc.Node = null;
    private flag: number = 0;
    private callBlock(type: number) {
        this.curB.destroy();
        this.curB = cc.instantiate(this.blocks[type]);
        this.node.addChild(this.curB);
        switch (type) {
            case 0: this.newB = new BlockS; this.cShadow = new BlockS; break;
            case 1: this.newB = new BlockI; this.cShadow = new BlockI; break;
            case 2: this.newB = new BlockL; this.cShadow = new BlockL; break;
            case 3: this.newB = new BlockLI; this.cShadow = new BlockLI; break;
            case 4: this.newB = new BlockSquare; this.cShadow = new BlockSquare; break;
            case 5: this.newB = new BlockSI; this.cShadow = new BlockSI; break;
            case 6: this.newB = new BlockT; this.cShadow = new BlockT; break;
        }
        this.newB.board = this.arr;
        this.newB.node = this.curB;
    }
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.storeTimer = this.timer;
        this.playSoundTheme();
        this.GameOverPopUp.active = false;
        this.PausePopUp.active = false;
        this.initBoard();
        this.newBlock();
        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.isGameOver = true;
            this.PausePopUp.active = true;
            this.node.opacity = 50;
        });

        this.PauseButton.on('touchend', () => {
            this.isGameOver = true;
            this.PausePopUp.active = true;
            this.node.opacity = 50;
        });
        this.ResumeButton.on('touchend', () => {
            this.isGameOver = false;
            this.PausePopUp.active = false;
            this.node.opacity = 255;
        })
        this.QuitButton.on('touchend', () => {
            cc.director.loadScene('intro');
        })
        this.SoundButton.on('touchend', () => {
            if (Setting.soundState) {
                cc.audioEngine.stopAll();
                Setting.soundState = false;
                let sprite: cc.Sprite = this.SoundButton.getChildByName("Sound").getComponent(cc.Sprite);
                sprite.spriteFrame = this.SoundOffSprite;
            } else {
                this.SoundTheme.on;
                cc.audioEngine.playMusic(this.SoundTheme, true);
                Setting.soundState = true;
                let sprite: cc.Sprite = this.SoundButton.getChildByName("Sound").getComponent(cc.Sprite);
                sprite.spriteFrame = this.SoundOnSprite;
            }
        })
        this.HoldBlock.on('touchstart', () => {
            if (this.canHold && !this.isGameOver) {
                if (this.holdingBlockType == -1) {
                    this.holdingBlockType = this.r;
                     this.curB.destroy();
                    // this.holdingBlock = cc.instantiate(this.blocks[this.holdingBlockType])
                    // this.HoldBlock.addChild(this.holdingBlock);
                    // this.holdingBlock.zIndex = 0;
                    // this.holdingBlock.setPosition(-10, -10);
                    // this.holdingBlock.setScale(0.8, 0.8);
                    this.addBlockToHold();
                    this.newBlock();
                } else if (!this.isGameOver) {
                    //there is saved block
                    var temp = this.r;
                    this.curB.destroy();
                    this.callBlock(this.holdingBlockType);
                    this.holdingBlockType = temp;
                    // this.holdingBlock.destroy();
                    // this.holdingBlock = cc.instantiate(this.blocks[this.holdingBlockType])
                    // this.HoldBlock.addChild(this.holdingBlock);
                    // this.holdingBlock.zIndex = 0;
                    // this.holdingBlock.setPosition(-10, -10);
                    // this.holdingBlock.setScale(0.8, 0.8);
                    this.addBlockToHold();
                }
                this.canHold = false;
                this.isDragging = false;
            } else {
            }
        })
        this.node.on('touchstart', (e: cc.Event.EventTouch) => {
            this.startX = e.getLocation().x;
            this.startY = e.getLocation().y;
            this.flag = 0;
            this.isDragging = true;

        }, this.node);
        this.node.on('touchmove', (e: cc.Event.EventTouch) => {
            //   this.isSwipe = false;
            let distX: number = e.getLocationX();
            let distY: number = e.getLocationY();
            let dir = -1;
            let determine = Math.floor((distX - this.startX) / 20);
            let moveY = Math.floor(this.startY - distY);
            if (this.isDragging) {
                let deltaY = e.getDeltaY();
                if (deltaY < -20) {
                    this.doDropNow();
                    return;
                } else {
                }
                this.isSpeedUp = moveY > 50;
                if (this.isSpeedUp) {
                    this.isSwipe = false;
                }
                // this.dropNow = moveY > 30;
                // if (this.dropNow) {
                //     this.isSwipe = false;
                // }
                this.newB.dropNow = true;
                if (!this.isSpeedUp) {
                    if (determine > this.flag) {
                        dir = 0;    //move right
                        if (this.newB.checkMove(0)) {
                            this.newB.move(0);
                            if (Setting.soundState) {
                                cc.audioEngine.playEffect(this.SoundMove, false);
                            }
                            this.flag = determine;
                            this.isSwipe = true;
                            this.getShadow();
                        };
                    } else if (determine < this.flag) {
                        //move right
                        if (this.newB.checkMove(1)) {
                            this.newB.move(1);
                            if (Setting.soundState) {
                                cc.audioEngine.playEffect(this.SoundMove, false);
                            }
                            this.flag = determine;
                            this.isSwipe = true;
                            this.getShadow();
                        };

                    } else {
                        dir = -1;
                    }
                }

            }
        }, this.node);
        this.node.on('touchend', (e: cc.Event.EventTouch) => {
            this.endX = e.getLocation().x;
            this.endY = e.getLocation().y;
            let y = e.getLocationY();
            let sy = this.startY;
          //  if (!this.isDragging) {
                if (!this.isSpeedUp && !this.isGameOver && !this.isSwipe && Math.abs(e.getLocationY() - this.startY) < 5 && Math.abs(e.getLocationX() - this.startX) < 5) {
                    this.newB.rotate(false);
                    cc.audioEngine.playEffect(this.SoundRotate, false);
                    this.getShadow();
                } else {
                    this.isSwipe = false;
                }

          //  }

        }, this.node);

    }
    doDropNow() {
        try {
            this.newB.node.setPosition(this.cShadow.node.position);
        } catch (e) { }
    }
    playSoundTheme() {
        if (Setting.soundState) {
            Setting.soundThemeId = cc.audioEngine.playMusic(this.SoundTheme, true);
        } else {
            let sprite: cc.Sprite = this.SoundButton.getChildByName("Sound").getComponent(cc.Sprite);
            sprite.spriteFrame = this.SoundOffSprite;
        }
    }
    isBreakHighScore(): boolean {
        var highscoresJson = cc.sys.localStorage.getItem('highscores');
        var highscores: Array<any> = JSON.parse(highscoresJson);
        if (highscores == null) {
            highscores = [];
        }
        if (highscores.length < 5) {
            return true;
        } else {
            if (highscores[4].score < this.Score) {
                return true;
            }
        }
        return false;
    }
    saveHighScore() {
        //  cc.sys.localStorage.removeItem('highscores');
        var highscoresJson = cc.sys.localStorage.getItem('highscores');
        var highscores: Array<any> = JSON.parse(highscoresJson);
        if (highscores == null) {
            highscores = [];
        }
        let playerName: string = cc.sys.localStorage.getItem('playerName');
        if (playerName == null) {
            playerName = 'Anonymous';
        }
        var userScore = {
            name: playerName,
            score: this.Score
        }
        highscores.push(userScore);
        highscores = highscores.sort(function (a, b) {
            return b.score - a.score;
        });
        highscores = highscores.slice(0, 5);
        cc.sys.localStorage.setItem('highscores', JSON.stringify(highscores));

    }
    checkEat(y: number): boolean {
        try {
            for (let block of this.arr[y]) {
                if (block == null || block == undefined) {
                    return false;
                }
            }
        } catch (e) { return false; };
        return true;
    }
    checkImpact(blocks: Block): boolean {
        for (let block of blocks.node.children) {
            try {
                let cell = blocks.getCell(block);
                if ((this.arr[cell[0] + 1][cell[1]] !== undefined || this.arr[cell[0] + 1][cell[1]] !== null) && this.arr[cell[0] + 1][cell[1]].canDrop == false) {
                    return false;
                }
            } catch (e) {
            }

        }
        return true;
    }
    doEat(y: number) {
        for (let bl of this.arr[y]) {
            try {
                bl.destroy();
            } catch (e) { console.log("loi tai eat"); continue; }
        }
        cc.audioEngine.playEffect(this.SoundScore, false);
        this.Score += 1000;
        this.scoreLabel.string = this.Score.toString();
    }
    clean(y: number) {
        for (let i = 0; i < y; i++) {
            this.arr[y - i] = this.arr[y - i - 1];
            for (let block of this.arr[y - i]) {
                try {
                    block.y -= 16;
                } catch (e) { console.log("loi tai clean" + e); continue; }
            }
        }
        this.arr[0] = new Array<cc.Node>(10);

    }
    delay(ms: number) {
        return new Promise(
            resolve => setTimeout(resolve, ms)
        );
    }
    private shadow: cc.Node;
    private cShadow: any;
    getShadow() {
        if (this.shadow) this.shadow.destroy();
        this.shadow = cc.instantiate(this.newB.node);
        this.cShadow.node = this.shadow;
        while (this.cShadow.state != this.newB.state) {
            this.cShadow.rotate(true);
        }
        this.cShadow.calcEnd();
        while (this.cShadow.endY > -224 && this.checkImpact(this.cShadow)) {
            this.cShadow.node.setPosition(this.cShadow.node.x, this.cShadow.node.y - 16);
            this.cShadow.calcEnd();
        }
        this.node.addChild(this.shadow);
        this.shadow.opacity = 50;
    }
    drop(dt, now?: boolean) {
        // if (this.dropNow) {
        //     this.timer = 0;
        // } else {
        //     this.timer = this.storeTimer;
        //     this.dropNow = false;
        // }
        this.newB.calcEnd();

        if (!this.isGameOver) {
            if (this.newB.endY <= -224 || this.checkImpact(this.newB) == false) {
                if (!this.dropNow && this.countTimer < this.timer) {
                    this.countTimer += dt;
                    return;
                }
                //await this.delay(1000);
                let dinner: Array<number> = new Array();
                //    console.log(this.newB.node.children.length);
                for (let block of this.newB.node.children) {
                    try {
                        let cell = this.newB.getCell(block);
                        block.canDrop = false;
                        this.arr[cell[0]][cell[1]] = block;
                        this.newB.canDrop = false;
                    } catch (e) { return; };
                }
                console.log(this.arr);
                this.Score += 50;
                this.scoreLabel.string = this.Score.toString();
                for (let block of this.newB.node.children) {
                    let cell = this.newB.getCell(block);
                    if (this.checkEat(cell[0]) == true) {
                        //row nay an duoc nhung chua danh dau
                        //dinner danh dau nhung row co the an
                        if (dinner.indexOf(cell[0]) == -1)
                            dinner.push(cell[0]);
                    }
                }
                for (let i of dinner) {
                    this.doEat(i);
                }
                dinner.sort(function (a, b) {
                    return a - b;
                });
                for (let i of dinner) {
                    this.clean(i);
                }
                delete this.newB.board;
                delete this.newB;
                this.newBlock();
                this.getShadow();
            } else {
                //   if (this.checkImpact() == true) {
                if (now || this.countTimer >= this.timer) {
                    if (this.newB.canDrop) {
                        this.countTimer = 0;
                        this.newB.node.y -= 16;
                    }
                } else {
                    this.countTimer += dt;
                }
                //   this.newB.node.y -= 16;
            }
        }
    }
    update(dt) {
        if (!this.isGameOver) {
            if (this.isSpeedUp) {
                this.drop(dt, true);
                this.isSpeedUp = false;
            } else {
                this.drop(dt, this.dropNow);
            }
        }
        else {

        }
    }


}

