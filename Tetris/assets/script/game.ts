import SingleBlock from "./block";
import Block from "./block";
import BlockS from "./block-S";
import BlockI from "./block-I";
import BlockL from "./block-L";
import BlockLI from "./block-LI";
import BlockSquare from "./block-Sq";
import BlockSI from "./block-SI";
import BlockT from "./block-T";

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
    Score: number = 0;

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
    private next:number = -1;
    private nextNode: cc.Node = null;
    
    random(): number {
        return Math.floor(Math.random() * Math.floor(this.blocks.length));
    }

    newBlock() {

        var r = this.random();
        
        if (this.next == -1) {
            this.curB = cc.instantiate(this.blocks[r]);
        } else {
            this.curB = cc.instantiate(this.blocks[this.next]);
            r = this.next;
        }
        this.next = this.random();
  
        this.node.addChild(this.curB);
        switch (r) {
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
        this.nextNode.setPosition(-10,-10);
        this.nextNode.setScale(0.8,0.8);
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
        this.newBlock();
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
                if (!this.isSpeedUp) this.newB.rotate();
            }
        }, this.node);

    }

    checkEat(y: number): boolean {
        for (let block of this.arr[y]) {
            if (block == null || block == undefined) {
                return false;
            }
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
            } catch (e) {
            }

        }
        return true;
    }
    doEat(y: number) {

        for (let bl of this.arr[y]) {
            bl.destroy();
        }
        this.Score += 1000;
        this.scoreLabel.string = this.Score.toString();
    }
    clean(y: number) {
        for (let i = 0; i < y; i++) {
            this.arr[y - i] = this.arr[y - i - 1];
            for (let block of this.arr[y - i]) {
                try {
                    block.y -= 16;
                } catch (e) { }
            }
        }
    }
    delay(ms: number) {
        return new Promise(
            resolve => setTimeout(resolve, ms)
        );
    }
    drop(dt, now?: boolean) {
        this.newB.calcEnd();
        if (this.newB.endY <= -224 || this.checkImpact() == false) {
            this.delay(300);
            let dinner: Array<number> = new Array();
            for (let block of this.newB.node.children) {
                let cell = this.newB.getCell(block);
                block.canDrop = false;
                this.arr[cell[0]][cell[1]] = block;
                this.newB.canDrop = false;
                
            }
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
            dinner.sort(function(a,b) {
                return a-b;
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
        }
    }
    update(dt) {
        if (this.isSpeedUp) {
            this.drop(dt, true);
            this.drop(dt, true);
            this.drop(dt, true);
            this.isSpeedUp = false;
        } else {
            this.drop(dt);
        }
    }


}

