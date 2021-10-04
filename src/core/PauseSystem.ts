import GameScene from 'scenes/GameScene';

export default class PauseSystem {

    private paused = false;

    constructor (scene: GameScene) {

        // const spacebar = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // spacebar.onDown((): void => {
        //     console.log('prewss spacebar');
        // });
        scene.input.keyboard.on('keydown_SPACE', this.toggle.bind(this), this);
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
