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
export default class BlockT extends Block {

    checkMove(dir: number): boolean {
        this.calcEnd();
        if (!super.checkMove(dir)) return false;
        switch (dir) {
            //case right:
            case 0: {
                if (this.endX < (this.blockSize * 10)) return true;
                break;
            }
            //case left:
            case 1: {
                switch(this.state) {
                    case 0: 
                    case 2:
                    case 3:
                        if (this.node.x >= (0+this.blockSize * 2)) return true;
                        break;
                    case 1: 
                        if (this.node.x +16 >= (0+this.blockSize * 2)) return true;
                }
            }
        }
        return false;
    }

    calcEnd() {
        switch (this.state) {
            case 0:
                this.endX = this.node.x + this.blockSize * 2;
                this.endY = this.node.y;
                break;
            case 1:
                this.endX = this.node.x + this.blockSize * 2;
                this.endY = this.node.y;
                break;
            case 2:
                this.endX = this.node.x + this.blockSize * 2;
                this.endY = this.node.y;
                break;
            case 3:
                this.endX = this.node.x + this.blockSize;
                this.endY = this.node.y;
                break;
            
        }
    }
    canRotate(): boolean {
        var cell = this.getCell(this.node.children[0]);
        try {
            switch (this.state) {
                case 0: {
                    if (this.board[cell[0] + 1][cell[1] + 1] ) return false;
                    break;
                }
                case 1: {
                    if (this.board[cell[0] - 1][cell[1] - 1]) return false;
                    break;
                }
                case 2: {
                    if (this.board[cell[0] - 2][cell[1]]) return false;
                    break;
                }
                case 3: {
                    if (this.board[cell[0] - 1][cell[1] + 1]) return false;
                    break;
                }
            }
        } catch (e) {
            return false;
        };

        return true;
    }
    rotate(isShadow: boolean) {
        this.calcEnd();
        if (!isShadow) {
            if (!this.canRotate()) return;
        }
        //   this.node.angle = (this.node.angle - 90) % 180;
        let node1 = this.node.children[0];
        let node2 = this.node.children[1];
        let node3 = this.node.children[2];
        let node4 = this.node.children[3];
        //Block-S

        switch (this.state) {
            case 0:
                node1.setPosition(this.offset + this.blockSize * 2, this.offset + this.blockSize);
                node2.setPosition(this.offset + this.blockSize, this.offset + this.blockSize * 2);
                node3.setPosition(this.offset + this.blockSize, this.offset + this.blockSize * 1);
                node4.setPosition(this.offset + this.blockSize, this.offset);
                break;
            case 1:
                node1.setPosition(this.offset + this.blockSize, this.offset);
                node2.setPosition(this.offset, this.offset + this.blockSize);
                node3.setPosition(this.offset + this.blockSize, this.offset + this.blockSize);
                node4.setPosition(this.offset + 2 * this.blockSize, this.offset + this.blockSize);
                break;
            case 2:
                node1.setPosition(this.offset, this.offset + this.blockSize);
                node2.setPosition(this.offset + this.blockSize, this.offset + this.blockSize * 2);
                node3.setPosition(this.offset + this.blockSize, this.offset + this.blockSize * 1);
                node4.setPosition(this.offset + this.blockSize, this.offset);
                break;
            case 3:
                node1.setPosition(this.offset + this.blockSize, this.offset + this.blockSize);
                node2.setPosition(this.offset, this.offset);
                node3.setPosition(this.offset + this.blockSize, this.offset);
                node4.setPosition(this.offset + 2 * this.blockSize, this.offset);
                break;
        }
        this.state = (this.state + 1) % 4;
        this.calcEnd()
        while (this.endX > (this.blockSize * 10)) {
            this.node.setPosition(this.node.x - this.blockSize, this.node.y);
            this.calcEnd();
        }
        while (this.endX < (this.blockSize*2) || (this.state == 2 && this.node.x + this.blockSize < (this.blockSize * 2))) {
            this.node.setPosition(this.node.x + this.blockSize, this.node.y);
            this.calcEnd();
        }
    }

    // update (dt) {}
}
