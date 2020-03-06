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
export default class BlockSquare extends Block {

    checkMove(dir: number): boolean {
        this.calcEnd();
        if (!super.checkMove(dir)) return false;
        switch (dir) {
            //case right:
            case 0: {
                if (this.endX <  (0+this.blockSize * 10)) return true;
                break;
            }
            //case left:
            case 1: {
                if (this.node.x >=  (0+this.blockSize * 2)) return true;
            }
        }
        return false;
    }
    rotate() {
        
    }
    calcEnd() {
        this.endX = this.node.x + this.blockSize;
        this.endY = this.node.y;

    }

    // update (dt) {}
}
