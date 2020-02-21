import HighScoreInfo from "./highscoreInfo";

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
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    highscoreInfo: cc.Prefab = null;
    @property(cc.Node)
    backButton: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onLoad(){
        this.backButton.on('touchstart', ()=>{
            cc.director.loadScene('intro');
        })
        this.loadHighScore();
    }
    loadHighScore() {
        let highscoresJson = cc.sys.localStorage.getItem('highscores');
        let highscores: Array<any> = JSON.parse(highscoresJson);
        console.log(highscores);
        if (highscoresJson) {
            let i: number = 0;
            for (let highscore of highscores) {
                var highscoreNode = cc.instantiate(this.highscoreInfo);
                highscoreNode.getComponent("highscoreInfo").pos.string = (i+1).toString();
                highscoreNode.getComponent("highscoreInfo").playerName.string = highscore.name;
                highscoreNode.getComponent("highscoreInfo").score.string = highscore.score;
                this.node.addChild(highscoreNode);
                
                highscoreNode.setPosition(0, highscoreNode.y - 60 * i);
                i += 1;
            }
        }
    }
    // update (dt) {}
}
