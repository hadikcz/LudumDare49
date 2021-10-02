import Phaser from 'phaser';
import EffectManager from "effects/EffectManager";
import UI from "ui/UI";
import WorldEnvironment from "core/WorldEnvironment";

declare let window: any;

export default class GameScene extends Phaser.Scene {

    public effectManager!: EffectManager;
    public ui!: UI;
    private worldEnvironment!: WorldEnvironment;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        window.scene = this;
        this.cameras.main.setBackgroundColor('#00');
        this.cameras.main.setZoom(1);

        this.effectManager = new EffectManager(this);

        this.worldEnvironment = new WorldEnvironment(this);

        // game entitites HERE
        // let image = this.add.image(100, 100, 'abc');
        // setTimeout(() => {
        //     image.setPosition(150, 15);
        // }, 1000);

        this.ui = new UI(this);
    }

    update (): void {
        this.ui.update();
    }
}
