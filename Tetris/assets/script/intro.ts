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
    _isShake = false;
    onLoad() {
        this.loadPlayerName();
        this.EnterNamePopUp.active = false;
        this.playButton.on('touchend', () => {
            console.log("Play touched")
            cc.director.loadScene('game');
        });
        this.highScoreButton.on('touchend', () => {
            console.log("Highscore touched");
            cc.director.loadScene('leaderboards');
        })
        this.EnterNameButton.on('touchend', () => {
            console.log("Enter name clicked");
            this.openPopup();
        })
        this.OkButton.on('touchend', () => {
            this.saveName();
            this.closePopup();
         //   this.closePopup();
        })
        this.CancelButton.on('touchend', () => {
            this.closePopup();
        })
    }
    playIntroMusic() {
        if (Setting.soundState) {
            cc.audioEngine.pauseAll();
            Setting.soundState = false;
        } else {
            this.introMusic.on;
            cc.audioEngine.resumeAll();
            Setting.soundState = true;  
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
            console.log("Please enter name");
            this._isShake = true;
        } else {
            console.log("Your name: " + name);
            cc.sys.localStorage.setItem('playerName', name);
            this.PlayerName.string = name;
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
