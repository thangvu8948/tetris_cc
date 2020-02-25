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
export default class BlockS extends Block {


    checkMove(dir: number): boolean {
        this.calcEnd();
        if (!super.checkMove(dir)) return false;
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
        if (this.state == 0) {
            this.endX = this.node.x + this.blockSize * 2;
            this.endY = this.node.y;
        } else {
            this.endX = this.node.x + this.blockSize;
            this.endY = this.node.y;
        }
    }
    canRotate(): boolean {
        var cell = this.getCell(this.node.getChildByName("1"));
        try {
            if (this.state == 0) {
                if (this.board[cell[0] - 2][cell[1]] != null || this.board[cell[0] - 2][cell[1]] != undefined) return false;
                if (this.board[cell[0] - 1][cell[1]] != null || this.board[cell[0] - 1][cell[1]] != undefined) return false;
            } else {
                if (this.board[cell[0] + 2][cell[1]] != null || this.board[cell[0] + 2][cell[1]] != undefined) return false;
                if (this.board[cell[0] + 1][cell[1] + 2] != null || this.board[cell[0] + 1][cell[1] + 2] != undefined) return false;
                
            }
        } catch(e){
            return false;
        };

        return true;
    }
    rotate(isShadow: boolean) {
        this.calcEnd();
        if (!isShadow) {
            if (!this.canRotate()) return;
        }
        let node1 = this.node.getChildByName("1");
        let node2 = this.node.getChildByName("2");
        let node3 = this.node.getChildByName("3");
        let node4 = this.node.getChildByName("4");
        //Block-S

        if (this.state == 0) {
            node1.anchorY = -1.5;
            node4.anchorX = 0.5
        } else {
            node1.anchorY = 0.5;
            node4.anchorX = -1.5
        }
        this.state = this.state == 0 ? 1 : 0;
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
    ///Block-I
    // case 1: {
    //     if (this.state == 0) {
    //         this.endX = this.node.x + this.blockSize * 3;
    //         this.endY = this.node.y;
    //     } else {
    //         this.endX = this.node.x + this.blockSize;
    //         this.endY = this.node.y - this.blockSize;
    //     }
    // }



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
