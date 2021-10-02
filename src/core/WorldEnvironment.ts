import GameScene from 'scenes/GameScene';
import Grid from "core/Grid";
import {Depths} from "enums/Depths";
import Building from "entity/Building";

export default class WorldEnvironment {
    private scene: GameScene;

    constructor (scene: GameScene) {
        this.scene = scene;
        this.scene.add.image(0, 0, 'bg')
            .setOrigin(0, 0)
            .setDepth(Depths.BG_TEXTURE);

        new Grid(this.scene);

        new Building(this.scene, 600, 600, 'heating_plant');
    }

}
