import { Building } from 'enums/Building';
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

        $('#disconnect').on('click', () => {
            this.scene.pipeSystem.startDisconnectMode();
        });

        $('#cancelDisconnect').on('click', () => {
            this.scene.pipeSystem.stopDisconnectMode();
        });

        $('#buildSplitter').on('click', () => {
            this.scene.builder.startBuild(Building.SPLITTER);
        });

        $('#buildCombiner').on('click', () => {
            this.scene.builder.startBuild(Building.COMBINER);
        });

        $('#buildSwitch').on('click', () => {
            this.scene.builder.startBuild(Building.SWITCH);
        });

        $('#buildHeatingPlant').on('click', () => {
            this.scene.builder.startBuild(Building.HEATING_PLANT);
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
        $('.actionInfo').show();
        $('.socketInfo').show();
        $('#socketType').html(socketType);
    }

    hideSocket (): void {
        $('.socketInfo').hide();
        $('.actionInfo').hide();
    }

    showDisconnectMode (): void {
        $('.actionInfo').show();
        $('.disconnectInfo').show();
    }

    hideDisconnectMode (): void {
        $('.actionInfo').hide();
        $('.disconnectInfo').hide();
    }

    showSocketOccupied (): void {
        $('.socketOccupied').slideDown();
        setTimeout(() => {
            $('.socketOccupied').slideUp();
        }, 3000);
    }
}
