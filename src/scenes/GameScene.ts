import MusicPlayer from 'core/MusicPlayer';
import WorldEnvironment from 'core/WorldEnvironment';
import EffectManager from 'effects/EffectManager';
import Phaser from 'phaser';
import DatGui from 'ui/DatGui';
import UI from 'ui/UI';

declare let window: any;

export default class GameScene extends Phaser.Scene {

    public effectManager!: EffectManager;
    public ui!: UI;
    public datGui!: DatGui;
    public worldEnvironment!: WorldEnvironment;
    private musicPlayer!: MusicPlayer;

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
        this.musicPlayer = new MusicPlayer(this);
    }

    update (): void {
        this.ui.update();
        this.worldEnvironment.update();
    }
}
