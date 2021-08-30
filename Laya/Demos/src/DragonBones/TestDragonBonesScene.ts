import { ui } from "../ui/layaMaxUI";

export default class TestDragonBonesScene extends ui.test.TestDragonBonesSceneUI {


    onEnable(): void {
        let resource = [
            // "res/mecha_1002_101d_show/mecha_1002_101d_show_ske.json",
            // // "res/mecha_1002_101d_show/mecha_1002_101d_show_ske.dbbin",
            // "res/mecha_1002_101d_show/mecha_1002_101d_show_tex.json",
            // "res/mecha_1002_101d_show/mecha_1002_101d_show_tex.png"

            { url: "res/jdmachao/jdmachao_ske.dbbin", type: Laya.Loader.BUFFER },
            { url: "res/jdmachao/jdmachao_tex.json", type: Laya.Loader.JSON },
            { url: "res/jdmachao/jdmachao_tex.png", type: Laya.Loader.IMAGE },
        ];

        Laya.loader.load(resource, Laya.Handler.create(this, this.onLoadFinish))
    }

    onLoadFinish() {
        dragonBones.LayaFactory.init();
        const factory = dragonBones.LayaFactory.factory;
        // factory.parseDragonBonesData(this.game.cache.getItem("resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json", Phaser.Cache.JSON).data);
        let data = Laya.loader.getRes("res/jdmachao/jdmachao_ske.dbbin");
        console.log(data);
        factory.parseDragonBonesData(Laya.loader.getRes("res/jdmachao/jdmachao_ske.dbbin"));
        factory.parseTextureAtlasData(
            Laya.loader.getRes("res/jdmachao/jdmachao_tex.json"),
            Laya.loader.getRes("res/jdmachao/jdmachao_tex.png")
        );
        Laya.timer.frameLoop(1, this, () => {
            dragonBones.LayaFactory.factory.clock.advanceTime(0.016);
        })

        const armatureDisplay = factory.buildArmatureDisplay("jdmachao");
        armatureDisplay.animation.play("jn_r", 0);


        armatureDisplay.scaleX = 5;
        armatureDisplay.scaleY = 5;
        armatureDisplay.x = 200;
        armatureDisplay.y = 400.0;
        this.addChild(armatureDisplay);
    }
}