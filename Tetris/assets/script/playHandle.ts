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
    //#region  Property
    @property({ type: [cc.Prefab] })
    blocks: cc.Prefab[] = [];
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property
    timer: number = 2;

    @property(cc.Node)
    canvas: cc.Node = null;

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
    @property(cc.Prefab)
    particle: cc.Prefab = null;
    //#endregion
    //#region Variables
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
    private level: number = 0;
    private shadow: cc.Node;
    private cShadow: Block;
    private dinner: Array<number>
    private atom: cc.Node = null;
    private canHold: boolean = true;
    private holdingBlockType: number = -1;
    private holdingBlock: cc.Node = null;
    private flag: number = 0;
    private blockPoint: number = 10;
    private eatPoint: number = 200;
    private effectPool: cc.NodePool;
    //#endregion


    //#region LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.scaleScreen();
        this.storeTimer = this.timer;
        this.playSoundTheme();
        this.GameOverPopUp.active = false;
        this.PausePopUp.active = false;
        this.initBoard();
        this.newBlock();
        this.initEffectPool();
        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.pauseGamePopUp();
        });
        this.PauseButton.on('touchend', () => {
            this.pauseGamePopUp();
        });
        this.ResumeButton.on('touchend', () => {
            this.resumeGameFromPopUp();
        })
        this.QuitButton.on('touchend', () => {
            cc.director.loadScene('intro');
        })
        this.SoundButton.on('touchend', () => {
            this.handleSound();
        })
        this.HoldBlock.on('touchstart', () => {
            this.handleHold();
        })
        this.canvas.on('touchstart', (e: cc.Event.EventTouch) => {
            this.handlePlayTouchStart(e);
        }, this.node);
        this.canvas.on('touchmove', (e: cc.Event.EventTouch) => {
            this.handlePlayTouchMove(e);
        }, this.node);
        this.canvas.on('touchend', (e: cc.Event.EventTouch) => {
            this.handlePlayTouchEnd(e);
        }, this.node);

    }
    lateUpdate() {
        this.eatEffect();
    }
    update(dt) {
        if (!this.isGameOver) {
            this.handleDrop(dt);
        }
        else {

        }
    }
    //#endregion

    //#region Utils
    //Init effect pool
    initEffectPool() {
        this.effectPool = new cc.NodePool('effect');
        this.effectPool.put(cc.instantiate(this.particle));
    }
    //Tạo số ngẫu nhiên
    random(): number {
        return Math.floor(Math.random() * Math.floor(this.blocks.length));
    }
    //Tạo một block mới trên board
    //Random block mới ở next
    //Block mới được tạo trên board lấy từ next
    newBlock(): void {
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
        this.newB.blockSize = this.blockSize;
        this.getShadow();
        if (this.nextNode) this.nextNode.destroy();
        this.addBlockToNext();
        this.canHold = true;
        this.isDragging = false;

        //check game over
        if (this.checkGameOver()) {
            this.pauseGame();
            this.showGameOver();
        }
    }
    //Kiểm tra đã game over chưa
    checkGameOver(): boolean {
        for (let block of this.newB.node.children) {
            try {
                let cell = this.newB.getCell(block);
                if (this.arr[cell[0]][cell[1]]) return true;
            } catch (e) { continue };
        }
        return false;
    }
    //Hiển thị popup gameover, đồng thời lưu điểm nếu break highscore
    showGameOver() {
        this.Highscore.text = this.Score.toString();
        if (this.isBreakHighScore()) {
            this.saveHighScore();
        }
        this.GameOverPopUp.active = true;
        this.GameOverPopUp.zIndex = 99;
        this.node.opacity = 50;
        this.GameOverScore.string = this.Score.toString();
    }
    //đổi state sang dừng 
    pauseGame() {
        this.isGameOver = true;
    }
    //đổi state sang tiếp tục
    resumeGame() {
        this.isGameOver = false;
    }
    //render block next vào ô next
    addBlockToNext() {
        this.nextNode = cc.instantiate(this.blocks[this.next]);
        this.NextBlock.addChild(this.nextNode);
        this.nextNode.zIndex = 0;
        this.nextNode.setScale(0.8, 0.8);
        //set position for next block
        switch (this.next) {
            //BlockS
            case 0: this.nextNode.setPosition((-1.25) * this.blockSize, (-0.75) * this.blockSize); break;
            //BlockI
            case 1: this.nextNode.setPosition(this.blockSize * (-1.625), this.blockSize * (-0.5)); break;
            //block L
            case 2: this.nextNode.setPosition(this.blockSize * (-0.75), (-1.25) * this.blockSize); break;
            //blockLI
            case 3: this.nextNode.setPosition(this.blockSize * (-0.75), (-1.25) * this.blockSize); break;
            //block Square
            case 4: this.nextNode.setPosition(-0.75 * this.blockSize, (-0.75) * this.blockSize); break;
            //block SI
            case 5: this.nextNode.setPosition(this.blockSize * (-1.25), 0); break;
            //block T
            case 6: this.nextNode.setPosition(this.blockSize * -1.25, -0.75 * this.blockSize); break;
        }
    }
    //render block hold vào hold
    addBlockToHold() {
        if (this.holdingBlock) this.holdingBlock.destroy();
        //this.curB.destroy();
        this.holdingBlock = cc.instantiate(this.blocks[this.holdingBlockType]);
        this.HoldBlock.addChild(this.holdingBlock);
        this.holdingBlock.zIndex = 0;
        this.holdingBlock.setScale(0.8, 0.8);
        //set position for next block
        switch (this.holdingBlockType) {
            //BlockS
            case 0: this.holdingBlock.setPosition((-1.25) * this.blockSize, (-0.75) * this.blockSize); break;
            //BlockI
            case 1: this.holdingBlock.setPosition(this.blockSize * (-1.625), this.blockSize * (-0.5)); break;
            //block L
            case 2: this.holdingBlock.setPosition(this.blockSize * (-0.75), (-1.25) * this.blockSize); break;
            //blockLI
            case 3: this.holdingBlock.setPosition(this.blockSize * (-0.75), (-1.25) * this.blockSize); break;
            //block Square: 
            case 4: this.holdingBlock.setPosition(-0.75 * this.blockSize, (-0.75) * this.blockSize); break;
            //block SI:
            case 5: this.holdingBlock.setPosition(this.blockSize * (-1.25), 0); break;
            //block T
            case 6: this.holdingBlock.setPosition(this.blockSize * -1.25, -0.75 * this.blockSize); break;
        }
    }
    //Khởi tạo mảng 24x10
    initBoard() {
        this.arr = new Array(24);
        for (let i = 0; i < 24; i++) {
            this.arr[i] = new Array<cc.Node>(10);
        }
    }

    //Gọi block từ hold ra board
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
    //Scale màn hình 
    scaleScreen() {
        let currentScreenRatio: number = cc.winSize.width / cc.winSize.height;
        //TH: màn hình dọc dài
        if (currentScreenRatio < 0.5) {
            this.node.scaleX = 0.95;
            this.node.scaleY = 1.05;

        } else {    //Màn hình thường (ngang)
            let widget: cc.Widget = this.node.getComponent(cc.Widget);
            widget.horizontalCenter = -35;
            widget.isAlignHorizontalCenter = true;
            this.node.scale = 1.1;
        }
    }
    //Xử lí khi bấm nút âm thanh
    handleSound() {
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
    }
    //Hiển thị popup pause game
    pauseGamePopUp() {
        this.pauseGame();
        this.PausePopUp.active = true;
        this.canvas.opacity = 50;
    }
    //tắt popup pause game
    resumeGameFromPopUp() {
        this.resumeGame();
        this.PausePopUp.active = false;
        this.canvas.opacity = 255;
    }
    //xử lí cho block vào hold
    handleHold() {
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
        }
    }
    //#region Playing Touch Handling
    handlePlayTouchEnd(e) {
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
    }

    handlePlayTouchStart(e) {
        this.startX = e.getLocation().x;
        this.startY = e.getLocation().y;
        this.flag = 0;
        this.isDragging = true;
    }
    handlePlayTouchMove(e) {
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
            //  this.newB.dropNow = true;
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
    }
    //#endregion
    //Block rớt xuống đất ngay lập tức
    doDropNow() {
        try {
            this.newB.node.setPosition(this.cShadow.node.position);
        } catch (e) { }
    }
    //Chạy nhạc nền khi mở scene
    playSoundTheme() {
        if (Setting.soundState) {
            Setting.soundThemeId = cc.audioEngine.playMusic(this.SoundTheme, true);
        } else {
            let sprite: cc.Sprite = this.SoundButton.getChildByName("Sound").getComponent(cc.Sprite);
            sprite.spriteFrame = this.SoundOffSprite;
        }
    }
    //Kiểm tra điểm số hiện tại có break highscore
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
    //lưu highscore
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
    //kiểm tra hàng thứ "y" có thể ăn được ko
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
    //Kiểm tra viên gạch có chạm viên gạch nào ở dưới hay không
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
    //#region Eat A Line
    //Ăn một hàng 
    haveDinner() {
        //don ban an
        this.dinner = new Array();
        //len mon
        for (let block of this.newB.node.children) {
            let cell = this.newB.getCell(block);
            if (this.checkEat(cell[0]) == true) {
                //row nay an duoc nhung chua danh dau
                //dinner danh dau nhung row co the an
                if (this.dinner.indexOf(cell[0]) == -1)
                    this.dinner.push(cell[0]);
            }
        }
        //an
        for (let i of this.dinner) {
            this.doEat(i);
        }
        
        //sap xep
        this.dinner.sort(function (a, b) {
            return a - b;
        });
        //don
        for (let i of this.dinner) {
            this.clean(i);
        }
    }
    //Ăn hàng thứ "y"
    doEat(y: number) {
        for (let bl of this.arr[y]) {
            try {
                bl.destroy();
            } catch (e) { continue; }
        }
        cc.audioEngine.playEffect(this.SoundScore, false);
        this.Score += this.eatPoint;
    }
    //Hiệu ứng khi ăn
    private effectParticleSystem: cc.ParticleSystem;
    eatEffect() {

        try {
            if (this.dinner.length > 0) {
                
                if (this.atom == null) {
                    this.atom = this.effectPool.get();
                    this.effectParticleSystem = this.atom.getComponent(cc.ParticleSystem);
                    this.atom.zIndex = 99;
                    this.node.addChild(this.atom);
                }
                this.atom.x = (this.blockSize * 10) / 2;
                this.atom.y = (24 - this.dinner[0]) * this.blockSize;
                this.effectParticleSystem.resetSystem();
                this.dinner = [];
            }
        } catch (e) { };
    }
    //xử lí lại mảng sau khi ăn
    clean(y: number) {
        for (let i = 0; i < y; i++) {
            this.arr[y - i] = this.arr[y - i - 1];
            for (let block of this.arr[y - i]) {
                try {
                    block.y -= this.blockSize;
                } catch (e) { continue; }
            }
        }
        this.arr[0] = new Array<cc.Node>(10);
    }
    //#endregion

    //Vẽ bóng
    getShadow() {
        if (this.shadow) this.shadow.destroy();
        this.shadow = cc.instantiate(this.newB.node);
        this.cShadow.node = this.shadow;
        while (this.cShadow.state != this.newB.state) {
            this.cShadow.rotate(true);
        }
        this.cShadow.calcEnd();
        while (this.cShadow.endY > (0 + this.blockSize) && this.checkImpact(this.cShadow)) {
            this.cShadow.node.setPosition(this.cShadow.node.x, this.cShadow.node.y - this.blockSize);
            this.cShadow.calcEnd();
        }
        this.node.addChild(this.shadow);
        this.shadow.opacity = 50;
    }
    //Xử lí drop theo thời gian (đủ giây thì rớt)
    handleDrop(dt) {
        this.newB.calcEnd();
        if (this.checkBlockStop()) {
            if (!this.moveLast(dt)) {
                return;
            }
            this.assignBlockToArray();
            this.blockDownPoint();
            this.haveDinner();
            this.showScore();
            this.releaseOldBlockAndGenerateNewBlock();
            this.increaseLevel();
        } else {
            this.blockDropOneCell(dt, this.isSpeedUp);
            this.isSpeedUp = false;
        }
    }

    //Hiển thị điểm lên màn hình
    showScore() {
        this.scoreLabel.string = this.Score.toString();
    }
    //Tính điểm khi gạch rớt
    blockDownPoint() {
        this.Score += this.blockPoint;
    }
    //di chuyen sau khi gach cham dat
    //true: het thoi gian cho
    //false: van co the di chuyen duoc
    moveLast(dt): boolean {
        if (!this.dropNow && this.countTimer < this.timer) {
            this.countTimer += dt;
            return false;
        }
        return true;
    }
    //gan block vao mang
    assignBlockToArray() {
        for (let block of this.newB.node.children) {
            let cell = this.newB.getCell(block);
            block.canDrop = false;
            this.arr[cell[0]][cell[1]] = block;
            this.newB.canDrop = false;
        }
    }
    //Kiểm tra block còn rớt được nữa ko
    //true nếu không
    //false nếu còn rớt được
    checkBlockStop() {
        return (this.newB.endY <= (0 + this.blockSize) || this.checkImpact(this.newB) == false);
    }
    //Giải phóng block vừa rớt
    releaseOldBlockAndGenerateNewBlock() {
        delete this.newB.board;
        delete this.newB;
        this.newBlock();
        this.getShadow();
    }
    //Tăng độ khó
    increaseLevel() {
        if (Math.floor(this.Score / 10000) > this.level) {
            this.timer = this.timer * 0.8;
            this.level = Math.floor(this.Score / 10000);
        }
    }
    //Rớt 
    blockDropOneCell(dt, now: boolean) {
        if (now || this.countTimer >= this.timer) {
            if (this.newB.canDrop) {
                this.countTimer = 0;
                this.newB.node.y -= this.blockSize;
            }
        } else {
            this.countTimer += dt;
        }
    }

    //#endregion

}

