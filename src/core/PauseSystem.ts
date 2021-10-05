import GameScene from 'scenes/GameScene';


declare let __DEV__: any;
export default class PauseSystem {

    private paused = false;
    private fastForward: boolean = false;

    constructor (scene: GameScene) {
        scene.input.keyboard.on('keydown_SPACE', this.toggle.bind(this), this);

        const self = this;
        document.body.onkeyup = function (e) {
            if (e.keyCode == 32) {
                self.toggle();
            }
        };

        let shouldStartupWithPauseGame = !__DEV__;
        shouldStartupWithPauseGame = true;
        if (shouldStartupWithPauseGame) {
            setTimeout(() => {
                this.pause();
            }, 200);
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
