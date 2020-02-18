import SingleBlock from "./block";
import Block from "./block";

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

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property({type: [cc.Prefab]})
    blocks: cc.Prefab[] = [];

    @property
    timer: number = 2;


    private newB: Block = null;
    private countTimer: number = 0;
    private isSwipe: boolean = false;
    private startX: number;
    private endX: number;
    private curB: cc.Node;
    private count = 0;
    private arr: any;

    random(): number {
        return Math.floor(Math.random() * Math.floor(this.blocks.length));
    }

    newBlock() {
        var r = this.random();
        console.log(r);
        this.curB = cc.instantiate(this.blocks[r]);
        this.node.addChild(this.curB);
        this.newB = new Block();
        this.newB.node = this.curB;
        this.newB.kindOfBlock = r;
    }
    initBoard() {
        this.arr = new Array(24);
        for (let i = 0; i < 24; i++) {
            this.arr[i] = new Array<cc.Node>(10);
        }
    }
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.initBoard();
        console.log(this.arr);
        this.newBlock();
        this.node.on('touchstart', (e: cc.Event.EventTouch) => {
            this.startX = e.getLocation().x;
        }, this.node);
        this.node.on('touchmove', (e: cc.Event.EventTouch) => {
            this.isSwipe = true;
        }, this.node);
        this.node.on('touchend', (e: cc.Event.EventTouch) => {
            this.endX = e.getLocation().x;
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
                this.newB.rotate();
            }
        }, this.node);

    }

    checkEat(y: number): boolean {
        for (let block of this.arr[y]) {
            if (block == null || block == undefined) {
                return false;            }
        }
        return true;
    }
    checkImpact(): boolean {
        for (let block of this.newB.node.children) {
            try {
                let cell = this.newB.getCell(block);
                if ((this.arr[cell[0] + 1][cell[1]] !== undefined || this.arr[cell[0] + 1][cell[1]] !== null) && this.arr[cell[0] + 1][cell[1]].canDrop == false) {
                    return false;
                }
            } catch (e: Exception) {
            }

        }
        return true;
    }
    doEat(y: number) {
        for (let bl of this.arr[y]) {
            bl.destroy();
        }
        for (let i = 0; i < y; i++) {
            this.arr[y - i] = this.arr[y - i - 1]; 
            for (let block of this.arr[y - i]) {
                try {
                    block.y -= 16;
                } catch(e){}
            }
        }
    }
    update(dt) {
        this.newB.calcEnd();
        if (this.newB.endY <= -224 || this.checkImpact() == false) {
            for (let block of this.newB.node.children){
                let cell = this.newB.getCell(block);
                block.canDrop = false;
                this.arr[cell[0]][cell[1]] = block;
                this.newB.canDrop = false;
            }
            for (let block of this.newB.node.children) {
                let cell = this.newB.getCell(block);
                if (this.checkEat(cell[0]) == true) {
                    this.doEat(cell[0]);
                    console.log("Eated at line " + cell[0]);
                }
            }
            this.newB = null;
            this.newBlock();
        } else {
            //   if (this.checkImpact() == true) {
            if (this.countTimer < this.timer) {
                this.countTimer += dt;
            } else {
                this.countTimer = 0;
                this.newB.node.y -= 16;
                // if (this.newB.y <= -80) {
                //                   //  this.newB.removeChild(this.newB.getChildByName("1"));
                //     // this.newB = null;
                //     // this.newBlock();
                //     this.count += 1;
                // }
            }
        }

    }

}
}

