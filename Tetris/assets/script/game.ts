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



    @property
    text: string = 'hello';

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
    SoundRotate:cc.AudioClip = null;
    @property(cc.AudioClip)
    SoundScore: cc.AudioClip = null;
    @property(cc.SpriteFrame)
    SoundOnSprite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    SoundOffSprite: cc.SpriteFrame = null;
    
    private newB: any = null;
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
    private isGameOver = false;
    private soundState = true;
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
        //this.next = this.random();
        this.node.addChild(this.curB);
        switch (this.r) {
            case 0: this.newB = new BlockS; break;
            case 1: this.newB = new BlockI; break;
            case 2: this.newB = new BlockL; break;
            case 3: this.newB = new BlockLI; break;
            case 4: this.newB = new BlockSquare; break;
            case 5: this.newB = new BlockSI; break;
            case 6: this.newB = new BlockT; break;

        }
        this.newB.board = this.arr;
        this.newB.node = this.curB;
        if (this.nextNode) this.nextNode.destroy();
        this.nextNode = cc.instantiate(this.blocks[this.next]);
        this.NextBlock.addChild(this.nextNode);
        this.nextNode.zIndex = 0;
        this.nextNode.setPosition(-10, -10);
        this.nextNode.setScale(0.8, 0.8);
        this.canHold = true;

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
                    //var filepath = cc.url.raw("resources/highscore.txt");
                }
            } catch (e) { };
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
    private callBlock(type: number) {
        this.curB.destroy();
        this.curB = cc.instantiate(this.blocks[type]);
        this.node.addChild(this.curB);
        switch (type) {
            case 0: this.newB = new BlockS; break;
            case 1: this.newB = new BlockI; break;
            case 2: this.newB = new BlockL; break;
            case 3: this.newB = new BlockLI; break;
            case 4: this.newB = new BlockSquare; break;
            case 5: this.newB = new BlockSI; break;
            case 6: this.newB = new BlockT; break;
        }
        this.newB.board = this.arr;
        this.newB.node = this.curB;
    }
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.playSoundTheme();
        this.GameOverPopUp.active = false;
        this.PausePopUp.active = false;
        this.initBoard();
        this.newBlock();
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
                cc.audioEngine.pauseAll();
                Setting.soundState = false;
                let sprite: cc.Sprite = this.SoundButton.getChildByName("Sound").getComponent(cc.Sprite);
                sprite.spriteFrame = this.SoundOffSprite;
            } else {
                this.SoundTheme.on;
                cc.audioEngine.resumeAll();
                Setting.soundState = true;  
                console.log(this.SoundButton);
                let sprite: cc.Sprite = this.SoundButton.getChildByName("Sound").getComponent(cc.Sprite);
                sprite.spriteFrame = this.SoundOnSprite;
            }
        })
        this.HoldBlock.on('touchstart', () => {
            if (this.canHold && !this.isGameOver) {
                if (this.holdingBlockType == -1) {
                    this.holdingBlockType = this.r;
                    this.curB.destroy();
                    this.holdingBlock = cc.instantiate(this.blocks[this.holdingBlockType])
                    this.HoldBlock.addChild(this.holdingBlock);
                    this.holdingBlock.zIndex = 0;
                    this.holdingBlock.setPosition(-10, -10);
                    this.holdingBlock.setScale(0.8, 0.8);
                    this.newBlock();
                } else if (!this.isGameOver) {
                    //there is saved block
                    var temp = this.r;
                    this.curB.destroy();
                    this.callBlock(this.holdingBlockType);
                    this.holdingBlockType = temp;
                    this.holdingBlock.destroy();
                    this.holdingBlock = cc.instantiate(this.blocks[this.holdingBlockType])
                    this.HoldBlock.addChild(this.holdingBlock);
                    this.holdingBlock.zIndex = 0;
                    this.holdingBlock.setPosition(-10, -10);
                    this.holdingBlock.setScale(0.8, 0.8);
                }
                this.canHold = false;
            } else {
            }
        })
        this.node.on('touchstart', (e: cc.Event.EventTouch) => {
            this.startX = e.getLocation().x;
            this.startY = e.getLocation().y;
        }, this.node);
        this.node.on('touchmove', (e: cc.Event.EventTouch) => {
            this.isSwipe = true;
        }, this.node);
        this.node.on('touchend', (e: cc.Event.EventTouch) => {
            this.endX = e.getLocation().x;
            this.endY = e.getLocation().y;
            if (Math.abs(this.startX - this.endX) < 100 && (this.endY - this.startY < -50)) {
                this.isSpeedUp = true;
                this.isSwipe = false;
            }
            if (this.isSwipe) {
                if (this.endX > this.startX) {
                    if (this.newB.checkMove(0)) {
                        this.newB.move(0)
                    };
                } else {
                    if (this.newB.checkMove(1)) {
                        this.newB.move(1)
                    };
                }
                this.isSwipe = false;
            } else {
                //    console.log(this.newB.x);
                if (!this.isSpeedUp && !this.isGameOver) this.newB.rotate();
            }
        }, this.node);

    }
    playSoundTheme() {
        if (Setting.soundState) {
            Setting.soundThemeId = cc.audioEngine.playMusic(this.SoundTheme,true);
        } else {
            let sprite: cc.Sprite = this.SoundButton.getChildByName("Sound").getComponent(cc.Sprite);
            sprite.spriteFrame = this.SoundOffSprite;
        }
    }
    isBreakHighScore() : boolean{
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
        console.log(playerName);
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
    checkImpact(): boolean {
        for (let block of this.newB.node.children) {
            try {
                let cell = this.newB.getCell(block);
                if ((this.arr[cell[0] + 1][cell[1]] !== undefined || this.arr[cell[0] + 1][cell[1]] !== null) && this.arr[cell[0] + 1][cell[1]].canDrop == false) {
                    return false;
                }
            } catch (e) {
            }

        }
        return true;
    }
    async doEat(y: number) {
        try {
            for (let bl of this.arr[y]) {
                bl.destroy();
            }
        } catch (e) { };

        this.Score += 1000;
        this.scoreLabel.string = this.Score.toString();
    }
    clean(y: number) {
        for (let i = 0; i < y; i++) {
            this.arr[y - i] = this.arr[y - i - 1];
            for (let block of this.arr[y - i]) {
                try {
                    block.y -= 16;
                } catch (e) { continue; }
            }
        }
    }
    async delay(ms: number) {
        return new Promise(
            resolve => setTimeout(resolve, ms)
        );
    }
    async drop(dt, now?: boolean) {
        //   this.delay(10000);
        this.newB.calcEnd();
        if (!this.isGameOver) {


            if (this.newB.endY <= -224 || this.checkImpact() == false) {
                //    await this.delay(1000);
                let dinner: Array<number> = new Array();
                try {
                    for (let block of this.newB.node.children) {
                        let cell = this.newB.getCell(block);
                        block.canDrop = false;
                        this.arr[cell[0]][cell[1]] = block;
                        this.newB.canDrop = false;
                    }
                } catch (e) { };
                this.Score += 50;
                this.scoreLabel.string = this.Score.toString();
                for (let block of this.newB.node.children) {
                    let cell = this.newB.getCell(block);
                    if (this.checkEat(cell[0]) == true) {
                        dinner.push(cell[0]);
                    }
                }
                for (let i of dinner) {
                    this.doEat(i);
                    console.log("eat line " + i);
                }
                dinner.sort(function (a, b) {
                    return a - b;
                });
                for (let i of dinner) {
                    this.clean(i);
                    console.log("clean line " + i);
                }
                this.newB = null;
                this.newBlock();
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
    async update(dt) {
        if (!this.isGameOver) {
            if (this.isSpeedUp) {
                await this.drop(dt, true);
                await this.drop(dt, true);
                await this.drop(dt, true);
                this.isSpeedUp = false;
            } else {
                await this.drop(dt);
            }
        }
        else {

        }
    }


}

