import GameScene from 'scenes/GameScene';


declare let __DEV__: any;
export default class PauseSystem {

    private paused = false;

    constructor (scene: GameScene) {
        scene.input.keyboard.on('keydown_SPACE', this.toggle.bind(this), this);

        let shouldStartupWithPauseGame = !__DEV__;
        shouldStartupWithPauseGame = true;
        if (shouldStartupWithPauseGame) {
            this.pause();
        }
    }

    isPaused (): boolean {
        return this.paused;
    }

    pause (): void {
        this.paused = true;
    }

    unpause (): void {
        this.paused = false;
    }

    toggle (): void {
        this.paused = !this.paused;
    }

}
