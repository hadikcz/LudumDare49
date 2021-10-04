import GameScene from 'scenes/GameScene';


declare let __DEV__: any;
export default class PauseSystem {

    private paused = false;
    private fastForward: boolean = false;

    constructor (scene: GameScene) {
        scene.input.keyboard.on('keydown_SPACE', this.toggle.bind(this), this);

        let shouldStartupWithPauseGame = !__DEV__;
        // shouldStartupWithPauseGame = true;
        if (shouldStartupWithPauseGame) {
            this.pause();
        }
    }

    runFastForward (): void {
        this.fastForward = true;
    }

    isPaused (): boolean {
        return this.paused;
    }

    pause (): void {
        this.paused = true;
        this.fastForward = false;
    }

    unpause (): void {
        this.paused = false;
        this.fastForward = false;
    }

    isFastForward (): boolean {
        return this.fastForward;
    }

    toggle (): void {
        this.paused = !this.paused;
    }

}
