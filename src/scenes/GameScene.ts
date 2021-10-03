import Phaser from 'phaser';
import EffectManager from "effects/EffectManager";
import UI from "ui/UI";
import WorldEnvironment from "core/WorldEnvironment";
import DatGui from "ui/DatGui";

declare let window: any;

export default class GameScene extends Phaser.Scene {

    public effectManager!: EffectManager;
    public ui!: UI;
    public datGui!: DatGui;
    private worldEnvironment!: WorldEnvironment;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        window.scene = this;
        this.cameras.main.setBackgroundColor('#00');
        this.cameras.main.setZoom(1);

        this.datGui = new DatGui(this);

        this.effectManager = new EffectManager(this);

        this.worldEnvironment = new WorldEnvironment(this);
        window.worldEnvironment = this.worldEnvironment;

        this.ui = new UI(this);
    }

    update (): void {
        this.ui.update();
    }
}
