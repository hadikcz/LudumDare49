import $ from 'jquery';
import GameScene from 'scenes/GameScene';

export default class DayNightUI {

    private scene: GameScene;

    constructor (scene: GameScene) {
        this.scene = scene;
    }

    update (): void {
        $('#time').html(parseInt(String(this.scene.dayNightSystem.getTime())).toString());
        $('#calendar').html(this.scene.dayNightSystem.getDay());
    }
}
