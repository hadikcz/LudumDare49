import Phaser, {BlendModes} from 'phaser';
import {Depths} from "enums/Depths";
import NumberHelpers from "helpers/NumberHelpers";
import ChanceHelpers from "helpers/ChanceHelpers";

export default class SmokeEffect extends Phaser.GameObjects.Image {
    constructor (scene) {
        super(scene, -1000, -1000, 'smoke');

        this.scene.add.existing(this);
        this.setDepth(Depths.SMOKE);
        this.setActive(false);
        this.setVisible(false);
        // this.setBlendMode(BlendModes.LIGHTER);
    }

    launch (x, y, black = false, randomizePosition = false, randomize = 0) {
        if (randomizePosition) {
            this.setPosition(
                x + Phaser.Math.RND.integerInRange(-randomize, randomize),
                y + Phaser.Math.RND.integerInRange(-randomize, randomize)
            );
        } else {
            this.setPosition(x, y);
        }
        this.setVisible(true);
        this.setActive(true);
        this.setScale(1);
        // this.setAlpha(0.35);
        this.setAlpha(0);
        this.setRotation(Phaser.Math.RND.rotation());
        this.setTint(0xFFFFFF);

        let duration = Phaser.Math.RND.integerInRange(5500, 5700);
        // let duration = Phaser.Math.RND.integerInRange(2500, 2700);
        let targetSize = Phaser.Math.RND.integerInRange(0.5, 0.7);

        if (black) {
            if (ChanceHelpers.percentage(70)) {
                this.setTint(0x222222);
            } else {
                this.setTint(0x333333);
            }
        }
        // alpha (faster)
        this.scene.tweens.add({
            targets: this,
            alpha: 0.35,
            duration: 250,
            ease: 'Linear',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    alpha: 0,
                    // duration: duration - 300 ,
                    duration: duration - 50 ,
                    ease: 'Linear'
                });
            }
        });

        this.scene.tweens.add({
            targets: this,
            x: x + NumberHelpers.randomIntInRange(-30, 30),
            y: y + NumberHelpers.randomIntInRange(-40, -80),
            scaleX: targetSize,
            scaleY: targetSize,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                this.setActive(false);
                this.setVisible(false);
            }
        });
    }
}
