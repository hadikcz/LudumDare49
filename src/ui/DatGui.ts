import * as dat from 'dat.gui';
import { GUI } from 'dat.gui';
import GameScene from 'scenes/GameScene';
declare let __DEV__: any;

export default class DatGui {

    private scene: GameScene;
    public gui!: GUI;

    constructor (scene: GameScene) {
        this.scene = scene;
        if (!__DEV__) return;
        this.gui = new dat.GUI();

        // let folder1 = this.gui.addFolder('Camera');
        // folder1.add(this.scene.cameras.main, 'x', 0.1, 2).listen();
    }
}
