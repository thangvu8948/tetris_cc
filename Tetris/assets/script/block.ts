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
export default class Block extends cc.Component {
    @property
    timer: number = 2;

    // LIFE-CYCLE CALLBACKS:
    private canMoveRight: boolean;
    state: number = 0; 
    kindOfBlock:number = 0;
    blockSize = 16;
    endX: number;
    endY: number;
    canDrop:boolean = true;
    private countTimer: number = 0;
    board: any;
    
    onLoad () {
    }
    checkMove(dir: number) :boolean {
        console.log(dir);
        for (let block of this.node.children) {
            let cell = this.getCell(block);
            try {
                let leftCell = this.board[cell[0]][cell[1] - 1];
                let rightCell = this.board[cell[0]][cell[1] + 1];
                switch(dir) {
                    case 0: 
                        if ((rightCell != null || rightCell != undefined) && rightCell.canDrop == false){
                            console.log(rightCell);
                            return false;
                        } else break;
                    case 1:
                        if ((leftCell != null || leftCell != undefined) && leftCell.canDrop == false) {
                            console.log(leftCell);
                            return false;
                        } else break;
                }
            } catch(e){}

            
        }
        return true;
        
    }
    move(dir) {
        switch(dir) {
            case 0: {
                this.node.x += this.blockSize;
                break;
            }
            case 1: {
                this.node.x -= this.blockSize;
            }
        }
    }

    getCell(node: cc.Node){
        let anchorX = node.anchorX;
        let anchorY = node.anchorY;
        let coorX:number;
        let coorY: number;
        coorX = (-anchorX + 0.5) * this.blockSize;
        coorY = (-anchorY + 0.5) * this.blockSize;
        let cellX = (this.node.x + 72 + coorX)/16;
        let cellY = -(this.node.y - 144 + coorY)/16;
        return [cellY,cellX];
    }

    // rotate() {
    //     this.calcEnd();
    // //   this.node.angle = (this.node.angle - 90) % 180;
    //   let node1 = this.node.getChildByName("1");
    //   let node2 = this.node.getChildByName("2");
    //   let node3 = this.node.getChildByName("3");
    //   let node4 = this.node.getChildByName("4");
    //   switch(this.kindOfBlock) {
    //     //Block-S
    //     case 0: {
    //         if (this.state == 0) {
    //             node1.anchorY=-1.5;
    //             node4.anchorX=0.5
    //         } else {
    //             node1.anchorY=0.5;
    //             node4.anchorX=-1.5
    //         }
    //         break;
    //     }
    //     //Block-I
    //     case 1: {
    //         if (this.state == 0) {
    //             node1.anchorX = -0.5;
    //             node1.anchorY = 1.5;
    //             node3.anchorX = -0.5;
    //             node4.anchorX = -0.5;
    //             node3.anchorY = -0.5;
    //             node4.anchorY = -1.5
    //         } else {
    //             node1.anchorX = 0.5;
    //             node1.anchorY = 0.5;
    //             node3.anchorX = -1.5;
    //             node3.anchorY = 0.5;
    //             node4.anchorX = -2.5;
    //             node4.anchorY = 0.5
    //         }
    //         break;
    //     }
    //   }
    //     this.state = this.state == 0 ? 1 : 0;
    //     this.calcEnd()
    //     while (this.endX > 72) {
    //         this.node.setPosition(this.node.x - 16, this.node.y);
    //         this.calcEnd();
    //     } 
    //     while (this.endX < -56) {
    //         this.node.setPosition(this.node.x + 16, this.node.y);
    //         this.calcEnd();
    //     }
    // }
    // calcEnd() {
    //     switch(this.kindOfBlock) {
    //         //Case block-S
    //         case 0: {
    //             if (this.state == 0) {
    //                 this.endX = this.node.x + this.blockSize * 2;
    //                 this.endY = this.node.y;
    //             } else {
    //                 this.endX = this.node.x + this.blockSize;
    //                 this.endY = this.node.y;
    //             }
    //             break;
    //         }
    //         ///Block-I
    //         case 1: {
    //             if (this.state == 0) {
    //                 this.endX = this.node.x + this.blockSize * 3;
    //                 this.endY = this.node.y;
    //             } else {
    //                 this.endX = this.node.x + this.blockSize;
    //                 this.endY = this.node.y - this.blockSize;
    //             }
    //         }
    //     }
    // }

     update (dt) {

        //  if (this.checkDrop()) {
        //     if (this.countTimer < this.timer) {
        //         this.countTimer += dt;
        //     } else {
        //         this.countTimer = 0;
        //         this.node.y -= 16;
        //         console.log("state: " + this.state + " - " + this.node.y);
        //         // if (this.newB.y <= -80) {
        //         //                   //  this.newB.removeChild(this.newB.getChildByName("1"));
        //         //     // this.newB = null;
        //         //     // this.newBlock();
        //         //     this.count += 1;
        //         // }
        //     }
        //  } else {
        //      this.canDrop = false;
        //  }
     }
}
