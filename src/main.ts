import 'phaser';

import GameConfig from 'config/GameConfig';
import BootScene from 'scenes/BootScene';
import GameScene from 'scenes/GameScene';

declare let __DEV__: any;
const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    roundPixels: true,
    autoRound: true,
    parent: 'content',
    width: GameConfig.PhaserBasicSettings.gameSize.width,
    height: GameConfig.PhaserBasicSettings.gameSize.height,
    backgroundColor: GameConfig.PhaserBasicSettings.backgroundColor,
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    physics: {
        fps: 60,
        default: 'arcade',
        // matter: {
        //     fps: 60,
        //     // debug: true,
        //     gravity: {
        //         scale: 0
        //     },
        //     plugins: {
        //         attractors: true
        //     },
        //     // debug: {
        //     //     showBounds: true,
        //     //     showVelocity: true,
        //     //     showRotation: true
        //     // }
        // },
        arcade: {
            debug: true,
            gravity: { y: 200 }
        }
    },
    disableContextMenu: !__DEV__,
    antialias: true,
    scale: {
        // mode: Phaser.DOM.FILL,
        // mode: Phaser.Scale.CENTER_BOTH,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GameConfig.PhaserBasicSettings.gameSize.width,
        height: GameConfig.PhaserBasicSettings.gameSize.height
    },
    scene: [
        BootScene,
        GameScene
    ]
};
// @ts-ignore
const game = new Phaser.Game(config);
//
// let stats = new Stats();
// document.body.appendChild(stats.dom);
//
// requestAnimationFrame(function loop () {
//     stats.update();
//     requestAnimationFrame(loop);
// });
