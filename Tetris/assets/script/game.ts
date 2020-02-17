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

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    block: cc.Prefab = null;

    @property
    timer: number = 2;

    private newB:any = null;
    private countTimer: number = 0;
    newBlock() {
        this.newB = cc.instantiate(this.block);
        this.node.addChild(this.newB);   
        console.log("new block created at " + this.newB.x + "," + this.newB.y);
    }

    // LIFE-CYCLE CALLBACKS:
     onLoad () {
        if (this.newB == null)
            this.newBlock();
     }

    touchStart(e: cc.Event.EventTouch) : void {
        console.log(e.getLocation());
    }
    update (dt) {
        if (this.countTimer < this.timer) {
            this.countTimer += dt;
        }
        if (this.countTimer > this.timer && this.newB != null) {
            this.newB.setPosition(this.newB.x, this.newB.y - 16);
            this.countTimer = 0;
            if (this.newB.y <= -80) {
                this.newB = null;
                console.log("Block stopped");
                this.newBlock();
            }
        }
            

    
    }
}

