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
export default class Game extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    block: cc.Prefab = null;

    @property
    timer: number = 2;

    private newB:cc.Node = null;
    private countTimer: number = 0;
    private isSwipe: boolean = false;
    private startX: number;
    private endX: number;
    private curB:cc.Node;
    private count = 0;
    private arr :[cc.Node];
    newBlock() {
        this.newB = cc.instantiate(this.block);
        this.node.addChild(this.newB);   
    }
    
    // LIFE-CYCLE CALLBACKS:
    async onLoad () {
         await this.newBlock();
         this.node.on('touchstart', (e: cc.Event.EventTouch) => {
             this.startX = e.getLocation().x;
         }, this.node);
         this.node.on('touchmove', (e: cc.Event.EventTouch) => {
             this.isSwipe = true;
         }, this.node);
         this.node.on('touchend', (e: cc.Event.EventTouch) => {
             this.endX = e.getLocation().x;
             if (this.isSwipe) {
                if (this.endX < this.startX && this.newB != undefined) {
                    this.newB.setPosition(this.newB.x - 16, this.newB.y);
                } else if (this.endX > this.startX && this.newB != undefined) {
                    this.newB.setPosition(this.newB.x + 16, this.newB.y)
                }
                this.isSwipe = false;
             } else {
                 console.log(this.newB.x);
                 this.newB.angle = (this.newB.angle - 90) % 180;
             }
         }, this.node);

     }

    update (dt) {
        if (this.countTimer < this.timer) {
            this.countTimer += dt;
        }
        if (this.countTimer > this.timer && this.newB != null) {
            this.newB.setPosition(this.newB.x, this.newB.y - 16);
            this.countTimer = 0;
            if (this.newB.y <= -80) {
                console.log(this.newB);
                this.newB.removeChild(this.newB.getChildByName("1"));
                this.arr.push(this.newB);
                this.newB = null;
                this.newBlock();
                this.count += 1;
            }
        }
    }
}

