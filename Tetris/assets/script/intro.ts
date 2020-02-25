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

const {ccclass, property} = cc._decorator;
@ccclass
export default class Intro extends cc.Component {

    @property(cc.Node)
    playButton: cc.Node = null;

    @property(cc.Node)
    settingButton: cc.Node = null;

    @property(cc.Node)
    highScoreButton: cc.Node = null;

    @property(cc.Node)
    EnterNamePopUp: cc.Node = null;
    @property(cc.Node)
    EnterNameButton: cc.Node = null;

    @property(cc.EditBox)
    EditNameEB: cc.EditBox = null;
    @property(cc.Node)
    OkButton: cc.Node = null;
    @property(cc.Node)
    CancelButton: cc.Node = null;
    @property(cc.Label)
    PlayerName: cc.Label = null;
    @property(cc.AudioClip)
    introMusic: cc.AudioClip = null;
    @property(cc.SpriteFrame)
    SoundOnSprite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    SoundOffSprite: cc.SpriteFrame = null;
    _isShake = false;
    start() {
        this.playIntroMusic();
    }
    scaleDown() {
        let buttons = this.node.getChildByName('Buttons');
        let title = this.node.children[0].children[1];
        this.EnterNamePopUp.scale = cc.winSize.width / 400; 
        console.log(title);
        title.scale = cc.winSize.width / 400;
        let objsInButtons = buttons.children;
        for (let obj of objsInButtons) {
            obj.scale = cc.winSize.width / 400;
        }
    }
    onLoad() {
        this.scaleDown()
        this.loadPlayerName();
        this.EnterNamePopUp.active = false;
        this.playButton.on('touchend', () => {
            cc.director.loadScene('game');
        });
        this.highScoreButton.on('touchend', () => {
            cc.director.loadScene('leaderboards');
        })
        this.EnterNameButton.on('touchend', () => {
            this.openPopup();
        })
        this.OkButton.on('touchend', () => {
            this.saveName();
         //   this.closePopup();
        })
        this.CancelButton.on('touchend', () => {
            this.closePopup();
        })
        this.settingButton.on('touchend', () =>{
            this.turnSound();
        })
    }
    turnSound() {
        if (Setting.soundState == true) {
            Setting.soundState = false;
            cc.audioEngine.stopAll();
            let sprite: cc.Sprite = this.settingButton.getComponent(cc.Sprite);
            sprite.spriteFrame = this.SoundOffSprite;
        } else {
            Setting.soundState = true;
            cc.audioEngine.playMusic(this.introMusic, true);
            let sprite: cc.Sprite = this.settingButton.getComponent(cc.Sprite);
            sprite.spriteFrame = this.SoundOnSprite;
        }
    }
    playIntroMusic() {
        if (Setting.soundState) {
            cc.audioEngine.playMusic(this.introMusic, true);
        } else {
            cc.audioEngine.stopAll();
            let sprite: cc.Sprite = this.settingButton.getComponent(cc.Sprite);
            sprite.spriteFrame = this.SoundOffSprite;
        }
        
        
    }
    loadPlayerName() {
        let playerName: string = cc.sys.localStorage.getItem('playerName');
        if (playerName != null) {
            this.PlayerName.string = playerName;
        }
    }
    openPopup() {
        this.node.opacity = 50;
        this.EnterNamePopUp.active = true;
        let playerName: string = cc.sys.localStorage.getItem('playerName');
        if (playerName != null) {
            this.EditNameEB.string = playerName;
        }
    }
    closePopup() {
        this.node.opacity = 255;
        this.EnterNamePopUp.active = false;
    }
    saveName() {
        let name: string = this.EditNameEB.string;
        if (this.EditNameEB.string == "") {
            this._isShake = true;
        } else {
            cc.sys.localStorage.setItem('playerName', name);
            this.PlayerName.string = name;
            this.closePopup();
        }

    }

    _countTime: number = 0;
    _count: number = 0;

    update (dt) {
        if (this._isShake && this._count < 4) {

            this._countTime+=dt;
            if (this._countTime > 0.2) {
                if (this._count % 2 == 0) {
                    this.EditNameEB.node.setScale(1.2,1.2);
                } else {
                    this.EditNameEB.node.setScale(1,1);
                }
                this._countTime = 0;
                this._count++;
            }
        }
        if (this._count >= 4) {
            this._count = 0;
            this._isShake = false;
        }
    }
}
