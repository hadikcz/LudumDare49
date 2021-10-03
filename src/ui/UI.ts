import { SocketType } from 'enums/SocketType';
import $ from 'jquery';
import GameScene from 'scenes/GameScene';

export default class UI {

    private scene: GameScene;

    constructor (scene: GameScene) {
        this.scene = scene;

        $('#cancelSocket').on('click', () => {
            this.scene.pipeSystem.cancelConnecting();
        });
    }

    update () {
    }

    show (): void {
    }

    hide (): void {
    }

    showWin (): void {
        // @ts-ignore
        $('#level').html(window.level);
        // @ts-ignore
        $('#data').html(this.scene.dataUploading.getUploaded());
        $('.winPart').hide();
        $('.levelFinished').show();
        $('.win').slideDown('slow');
    }

    hideWin (): void {
        $('.win').slideUp('slow');
    }

    showLose (): void {
        $('.winPart').hide();
        $('.failed').show();
        $('.win').slideDown('slow');
    }

    showGameOver (): void {
        $('.winPart').hide();
        $('.gameOver').show();
        $('.win').slideDown('slow');
    }

    showSocket (socketType: SocketType): void {
        console.log('hrrr');
        $('.socketTypeWrapper').show();
        $('#socketType').html(socketType);
    }

    hideSocket (): void {
        $('.socketTypeWrapper').hide();
    }
}
