import DayNightApplier from 'core/DayNightApplier';
import { Events } from 'enums/Events';
import GameScene from 'scenes/GameScene';

export default class DayNightSystem {


    private static readonly NIGHT_STARTS = 23;
    private static readonly NIGHT_ENDS = 4;
    public static readonly ITERATE_VALUE = 0.1;

    private scene: GameScene;
    private currentTime: number = 5;
    private day: number = 1;
    private dayNightApplier: DayNightApplier;
    private night = false;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.dayNightApplier = new DayNightApplier(this.scene);

        this.scene.time.addEvent({
            delay: 500,
            loop: true,
            callbackScope: this,
            callback: this._update
        });
    }

    getTime (): number {
        return this.currentTime;
    }

    getDay (): number {
        return this.day;
    }

    isNight (): boolean {
        return this.night;
    }

    isDay (): boolean {
        return !this.night;
    }

    private _update (): void {
        if (this.scene.pause.isPaused()) return;
        this.currentTime += DayNightSystem.ITERATE_VALUE;

        // night starts
        // becuase iteration can not be exact but some small 0.000001 can be added
        if (this.currentTime > DayNightSystem.NIGHT_STARTS - DayNightSystem.ITERATE_VALUE / 2 && this.currentTime < DayNightSystem.NIGHT_STARTS + DayNightSystem.ITERATE_VALUE / 2) {
            this.scene.events.emit(Events.NIGHT_STARTED);
            console.log('night started');
            this.night = true;
        } else if (this.currentTime > DayNightSystem.NIGHT_ENDS - DayNightSystem.ITERATE_VALUE / 2 && this.currentTime < DayNightSystem.NIGHT_ENDS + DayNightSystem.ITERATE_VALUE / 2) {
            this.scene.events.emit(Events.DAY_STARTED);
            this.night = false;
        }

        this.currentTime = parseFloat(this.currentTime.toFixed(1));
        if (this.currentTime > 24) {
            this.currentTime = 0;
            this.day++;
            this.scene.events.emit('changeDay', this.day);
            console.log('new day');
        }
    }
}
