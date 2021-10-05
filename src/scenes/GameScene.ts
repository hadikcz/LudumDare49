import GameConfig from 'config/GameConfig';
import Builder from 'core/Builder';
import DayNightSystem from 'core/DayNightSystem';
import Destroyer from 'core/Destroyer';
import MusicPlayer from 'core/MusicPlayer';
import PauseSystem from 'core/PauseSystem';
import PipeSystem from 'core/PipeSystem';
import WorldEnvironment from 'core/WorldEnvironment';
import EffectManager from 'effects/EffectManager';
import Phaser from 'phaser';
import DatGui from 'ui/DatGui';
import UI from 'ui/UI';

declare let window: any;
declare let __DEV__: any;

export default class GameScene extends Phaser.Scene {

    public effectManager!: EffectManager;
    public ui!: UI;
    public datGui!: DatGui;
    public worldEnvironment!: WorldEnvironment;
    private musicPlayer!: MusicPlayer;
    public pipeSystem!: PipeSystem;
    public builder!: Builder;
    public pause!: PauseSystem;
    public destroyer!: Destroyer;
    public dayNightSystem!: DayNightSystem;
    public money = 100;
    public mouseCircle!: Phaser.Geom.Circle;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        window.scene = this;
        this.cameras.main.setBackgroundColor('#00');
        this.cameras.main.setZoom(1);

        this.mouseCircle = new Phaser.Geom.Circle(-100, -100, 5);

        this.datGui = new DatGui(this);

        this.pause = new PauseSystem(this);

        this.effectManager = new EffectManager(this);

        this.worldEnvironment = new WorldEnvironment(this);
        window.worldEnvironment = this.worldEnvironment;

        this.dayNightSystem = new DayNightSystem(this);
        this.builder = new Builder(this, this.worldEnvironment);
        this.destroyer = new Destroyer(this, this.worldEnvironment);
        this.pipeSystem = new PipeSystem(this, this.worldEnvironment);

        this.ui = new UI(this);
        this.musicPlayer = new MusicPlayer(this);

        this.time.addEvent({
            delay: GameConfig.heatCycle,
            callbackScope: this,
            repeat: Infinity,
            callback: () => {
                if (this.pause.isPaused()) return;
                this.pipeSystem.updateHeat();
            }
        });

        if (__DEV__) {
            this.money = 1000;
        }
    }

    update (): void {
        this.mouseCircle.setPosition(this.input.activePointer.worldX, this.input.activePointer.worldY);
        this.ui.update();
        this.builder.update();
        this.worldEnvironment.update();
        this.pipeSystem.update();
    }
}
