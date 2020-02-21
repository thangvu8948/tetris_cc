import Game from "./game";

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

enum ColorFont {
    First = "#A74242",
    Second = "#A57575"
}

@ccclass
export default class GameOver extends cc.Component {

    @property(cc.Node)
    GameOverLabel: cc.Node = null;
    @property(cc.Node)
    YesButton: cc.Node = null;
    @property(cc.Node)
    NoButton: cc.Node = null;
    

    timer: number = 0.5;
    count: number = 0;
    stateOfColor: number = 0;
    // LIFE-CYCLE CALLBACKS:    

    onLoad () {
          this.YesButton.on('touchstart', () =>{
            cc.director.loadScene('game');
        });
        this.NoButton.on('touchstart', () => {
            cc.director.loadScene('intro');
            cc.director.resume();
        })
    }

    
    update (dt) {
        if (this.count < this.timer) {
            this.count += dt;
        } else {
            if (this.stateOfColor == 0){
                this.GameOverLabel.color = cc.color().fromHEX(ColorFont.First);
                this.stateOfColor = 1;
            } else {
                this.GameOverLabel.color = cc.color().fromHEX(ColorFont.Second);
                this.stateOfColor = 0;
            }
            this.count = 0;
        }
        console.log(this.stateOfColor);
    }
}
