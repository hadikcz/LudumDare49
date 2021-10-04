import GameScene from 'scenes/GameScene';
import BaseSound = Phaser.Sound.BaseSound;
import ArrayHelpers from 'helpers/ArrayHelpers';

export default class MusicPlayer {

    private scene: GameScene;
    private music: BaseSound[] = [];
    private currentMusic: number = 0;


    constructor (scene: GameScene) {
        this.scene = scene;

        this.music['music1'] = this.scene.sound.add('music1');
        this.music['music2'] = this.scene.sound.add('music2');
        this.music['music3'] = this.scene.sound.add('music3');
        this.music['music4'] = this.scene.sound.add('music4');
        this.music['music5'] = this.scene.sound.add('music5');

        this.playRandomMusicExpectCurrent();
    }

    playRandomMusicExpectCurrent (): void {
        let musicList = [1,2,3,4,5];
        let indexOf = musicList.indexOf(this.currentMusic);
        musicList.splice(indexOf, 1);

        this.currentMusic = ArrayHelpers.getRandomFromArray(musicList);
        console.log('playing ' + this.currentMusic);
        const musicToPlay = this.music['music' + this.currentMusic];

        musicToPlay.play({
            loop: false
        });
        musicToPlay.once('complete', () => {
            this.playRandomMusicExpectCurrent();
        });
    }
}
