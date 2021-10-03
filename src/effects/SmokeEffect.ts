import Phaser from 'phaser';
import {Depths} from "enums/Depths";

export default class SmokeEffect extends Phaser.GameObjects.Image {
    constructor (scene) {
        super(scene, -1000, -1000, 'smoke');

        this.scene.add.existing(this);
        this.setDepth(Depths.SMOKE);
        this.setActive(false);
        this.setVisible(false);
    }

    launch (x, y, black = false, randomizePosition = false) {
        if (randomizePosition) {
            this.setPosition(
                x + Phaser.Math.RND.integerInRange(-20, 20),
                y + Phaser.Math.RND.integerInRange(-20, 20)
            );
        } else {
            this.setPosition(x, y);
        }
        this.setVisible(true);
        this.setActive(true);
        this.setScale(1);
        this.setAlpha(1);
        this.setRotation(Phaser.Math.RND.rotation());
        this.setTint(0xFFFFFF);

        let duration = Phaser.Math.RND.integerInRange(2500, 2700);
        let targetSize = Phaser.Math.RND.integerInRange(0.5, 0.7);

        if (black) {
            this.setTint(0x444444);
            duration = Phaser.Math.RND.integerInRange(2900, 3100);
        }

        // alpha (faster)
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: duration - 300,
            ease: 'Linear'
        });

        this.scene.tweens.add({
            targets: this,
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
