import { ui } from "../ui/layaMaxUI";

export default class TestDragonBonesScene extends ui.test.TestDragonBonesSceneUI {

    private res: { [key: string]: { ske: string, json: string, png: string } } = {
        "jdmachao": {
            ske: "res/jdmachao/jdmachao_ske.dbbin",
            json: "res/jdmachao/jdmachao_tex.json",
            png: "res/jdmachao/jdmachao_tex.png"
        },
        "bullet_01": {
            ske: "res/bullet_01/bullet_01_ske.json",
            json: "res/bullet_01/bullet_01_tex.json",
            png: "res/bullet_01/bullet_01_tex.png"
        },
        "mecha_1004d": {
            ske: "res/mecha_1004d/mecha_1004d_ske.json",
            json: "res/mecha_1004d/mecha_1004d_tex.json",
            png: "res/mecha_1004d/mecha_1004d_tex.png"
        },
        "mecha_1406": {
            ske: "res/mecha_1406/mecha_1406_ske.dbbin",
            json: "res/mecha_1406/mecha_1406_tex.json",
            png: "res/mecha_1406/mecha_1406_tex.png"
        },
        "mecha_1502b": {
            ske: "res/mecha_1502b/mecha_1502b_ske.json",
            json: "res/mecha_1502b/mecha_1502b_tex.json",
            png: "res/mecha_1502b/mecha_1502b_tex.png"
        },
    }

    private armatureDisplay: dragonBones.LayaArmatureDisplay;
    private aniIndex: number = 0;


    onEnable(): void {

        const createResourceItem = (path: string) => {
            if (path.endsWith(".dbbin")) {
                return { url: path, type: Laya.Loader.BUFFER };
            }
            if (path.endsWith(".json")) {
                return { url: path, type: Laya.Loader.JSON };
            }
            if (path.endsWith(".png")) {
                return { url: path, type: Laya.Loader.IMAGE };
            }
        }

        let resource = [];
        for (const key in this.res) {
            resource.push(createResourceItem(this.res[key].ske));
            resource.push(createResourceItem(this.res[key].json));
            resource.push(createResourceItem(this.res[key].png));
        }

        Laya.loader.load(resource, Laya.Handler.create(this, this.onLoadFinish))
    }

    onLoadFinish() {
        const factory = dragonBones.LayaFactory.factory;

        for (const key in this.res) {
            factory.parseDragonBonesData(Laya.loader.getRes(this.res[key].ske));
            factory.parseTextureAtlasData(
                Laya.loader.getRes(this.res[key].json),
                Laya.loader.getRes(this.res[key].png)
            );
        }

        //Laya.timer.loop(3000, this, this.randPlay);
        Laya.timer.loop(3000, this, this.playNextAni);
        this.randPlay();
    }

    randPlay() {
        let keys = Object.keys(this.res);
        if (keys.length <= 0) {
            return;
        }
        let name = keys[Math.floor(Math.random() * 10000) % keys.length];

        if (this.armatureDisplay) {
            this.armatureDisplay.parent.removeChild(this.armatureDisplay);
            this.armatureDisplay.dispose();
            this.armatureDisplay = null;
        }

        this.armatureDisplay = dragonBones.LayaFactory.factory.buildArmatureDisplay(name);
        this.armatureDisplay.x = 320;
        this.armatureDisplay.y = 600;
        this.addChild(this.armatureDisplay);
        this.aniIndex = 0;
    }

    playNextAni() {
        if (!this.armatureDisplay) {
            this.randPlay();
            return;
        }

        let aniNames = this.armatureDisplay.animation.animationNames;
        if (this.aniIndex >= aniNames.length) {
            this.randPlay();
            return;
        }
        let aniName = aniNames[this.aniIndex];
        this.armatureDisplay.animation.play(aniName, 0);
        this.aniIndex++;
    }
}