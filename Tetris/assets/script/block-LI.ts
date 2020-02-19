import BlockL from "./block-L";
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

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockLI extends Block {

    checkMove(dir: number): boolean {
        this.calcEnd();
        switch (dir) {
            //case right:
            case 0: {
                if (this.endX < 72) return true;
                break;
            }
            //case left:
            case 1: {
                if (this.node.x >= -56) return true;
            }
        }
        return false;
    }

    calcEnd() {
        if (this.state == 0 || this.state == 2) {
            this.endX = this.node.x + this.blockSize;
            this.endY = this.node.y;
        } else if (this.state == 1) {
            this.endX = this.node.x + this.blockSize * 2;
            this.endY = this.node.y;
        } else {
            this.endX = this.node.x + this.blockSize * 2;
            this.endY = this.node.y + this.blockSize;
        }
    }
    rotate() {
        this.calcEnd();
        //   this.node.angle = (this.node.angle - 90) % 180;
        let node1 = this.node.getChildByName("1");
        let node2 = this.node.getChildByName("2");
        let node3 = this.node.getChildByName("3");
        let node4 = this.node.getChildByName("4");
        //Block-L
        switch(this.state) {
            //default
            case 0: 
                node3.setAnchorPoint(0.5, -0.5);
                node4.setAnchorPoint(-1.5, 0.5);
                break;
            case 1:
                node2.setAnchorPoint(0.5, -1.5);
                node4.setAnchorPoint(-0.5, -1.5);
                break;
            case 2:
                node1.setAnchorPoint(0.5, -0.5);
                node2.setAnchorPoint(-0.5, -0.5);
                node3.setAnchorPoint(-1.5, -0.5);
                node4.setAnchorPoint(-1.5, 0.5);
                break;
            case 3: 
                node1.setAnchorPoint(0.5, 0.5);
                node2.setAnchorPoint(-0.5, 0.5);
                node3.setAnchorPoint(-0.5, -0.5);
                node4.setAnchorPoint(-0.5, -1.5);
                break;
        }
        this.state = (this.state + 1) % 4;
        this.calcEnd()
        while (this.endX > 72) {
            this.node.setPosition(this.node.x - 16, this.node.y);
            this.calcEnd();
        }
        while (this.endX < -56) {
            this.node.setPosition(this.node.x + 16, this.node.y);
            this.calcEnd();
        }
    }
    // update (dt) {}
}
