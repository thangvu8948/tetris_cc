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
export default class BlockI extends Block {
    checkMove(dir: number): boolean {
        if (!super.checkMove(dir)) return false;
        this.calcEnd();
        switch (dir) {
            //case right:
            case 0: {
                if (this.endX <  (0+this.blockSize * 10)) return true;
                break;
            }
            //case left:
            case 1: {
                if (this.state == 0) {
                    if (this.node.x >=  (0+this.blockSize * 2)) return true;
                } else {
                    if (this.node.x >=   (0+this.blockSize)) return true;
                }
            }
        }
        return false;
    }

    calcEnd() {
        if (this.state == 0) {
            this.endX = this.node.x + this.blockSize * 3;
            this.endY = this.node.y;
        } else {
            this.endX = this.node.x + this.blockSize;
            this.endY = this.node.y - this.blockSize;
        }
    }

    canRotate(): boolean {
        var cell = this.getCell(this.node.children[0]);
        try {
            if (this.state == 0) {
                if (this.board[cell[0] + 1][cell[1] + 1] != null || this.board[cell[0] + 1][cell[1] + 1] != undefined) return false;
                if (this.board[cell[0] - 1][cell[1] + 1] != null || this.board[cell[0] + 1][cell[1] + 1] != undefined) return false;
                if (this.board[cell[0] - 2][cell[1] + 1] != null || this.board[cell[0] + 1][cell[1] + 1] != undefined) return false;
            } else {
                if (this.board[cell[0] - 1][cell[1] - 1] != null || this.board[cell[0] + 1][cell[1] + 1] != undefined) return false;
                if (this.board[cell[0] - 1][cell[1] + 1] != null || this.board[cell[0] + 1][cell[1] + 1] != undefined) return false;
                if (this.board[cell[0] - 1][cell[1] + 2] != null || this.board[cell[0] + 1][cell[1] + 1] != undefined) return false;
            }
        } catch(e){
            return false;
        };

        return true;
    }
    doRotate(node: cc.Node) {
        let node1 = node.children[0];
        let node2 = node.children[1];
        let node3 = node.children[2];
        let node4 = node.children[3];

        if (this.state == 0) {
            node1.anchorX = -2;
            node1.anchorY = 1;
            node3.anchorX = -1;
            node4.anchorX = -1;
            node3.anchorY = -1;
            node4.anchorY = -2;
        } else {
            node1.anchorX = 0.5;
            node1.anchorY = 0.5;
            node3.anchorX = -1.5;
            node3.anchorY = 0.5;
            node4.anchorX = -2.5;
            node4.anchorY = 0.5;
        }
    }
    rotate(isShadow: boolean) {
        this.calcEnd();
        if (!isShadow) {
            if (!this.canRotate()) return;
        }       
        //   this.node.angle = (this.node.angle - 90) % 180;
        let node1 = this.node.getChildByName("1");
        let node2 = this.node.getChildByName("2");
        let node3 = this.node.getChildByName("3");
        let node4 = this.node.getChildByName("4");

        let clone = new cc.Node();
        clone = this.node;
        this.doRotate(clone);

        if (this.state == 0) {
            node1.anchorX = -1;
            node1.anchorY = 1;
            node3.anchorX = -1;
            node4.anchorX = -1;
            node3.anchorY = -1;
            node4.anchorY = -2;
        } else {
            node1.anchorX = 0;
            node1.anchorY = 0;
            node3.anchorX = -2;
            node3.anchorY = 0;
            node4.anchorX = -3;
            node4.anchorY = 0;
        }
        this.state = this.state == 0 ? 1 : 0;
        this.calcEnd()
        while (this.endX > (this.blockSize * 10)) {
            this.node.setPosition(this.node.x - 16, this.node.y);
            this.calcEnd();
        }
        while (this.node.x < (this.blockSize * 2) && this.state == 1) {
            this.node.setPosition(this.node.x + 16, this.node.y);
            this.calcEnd();
        }
        while (this.node.x < this.blockSize && this.state == 0) {
            this.node.setPosition(this.node.x + 16, this.node.y);
            this.calcEnd();
        }
    }

    // update (dt) {}
}
