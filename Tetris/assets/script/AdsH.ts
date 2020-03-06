import Setting from "./settings";

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
export default class Ads extends cc.Component {
        
    onLoad() {
        this.node.on('touchend', () => {
            if (Setting.isShowAds) {
                console.log("remove ads");  
                this.RemoveBannerAds();
            } else {
                console.log("show ads");  
                this.ShowBannerAds();
            }

        })
    }

    RemoveBannerAds() {
        if(cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("Hide ads")
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Ads", "RemoveBannerAds", "()V");
            Setting.isShowAds = false;
        } else {
            console.log("No Android")
        }
    }
    ShowBannerAds() {
        if(cc.sys.os === cc.sys.OS_ANDROID) {
            console.log("Show ads")
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Ads", "ShowBannerAds", "()V");
            Setting.isShowAds = true;
        } else {
            console.log("No Android")
        }
    }
    static OpenVideoAds() {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            if (Setting.isShowAds) {
                console.log("Opening video ads");
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Ads", "PlayVideoAds", "()V");
            }
        }
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // update (dt) {}
}
