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

        $('#cancelBuilding').on('click', () => {
            this.scene.builder.cancelBuilding();
        });

        $('#cancelDestroy').on('click', () => {
            this.scene.destroyer.cancelBuilding();
        });


        $('#disconnect').on('click', () => {
            if (this.scene.builder.isBuildMode() || this.scene.destroyer.isDestroyMode()) return;
            this.scene.pipeSystem.startDisconnectMode();
        });
        $('#showAll').on('click', () => {
            if (this.scene.pipeSystem.isShowAllMode()) {
                $('#showAll').html('Show all numbers');
                this.scene.pipeSystem.stopShowAllMode();
            } else {
                $('#showAll').html('Hide all numbers');
                this.scene.pipeSystem.startShowAllMode();
            }
        });

        $('#destroy').on('click', () => {
            if (this.scene.builder.isBuildMode() || this.scene.pipeSystem.isDisconnectMode()) return;
            this.scene.destroyer.startDestroy();
        });

        $('#cancelDisconnect').on('click', () => {
            this.scene.pipeSystem.stopDisconnectMode();
        });

        $('#buildSplitter').on('click', () => {
            if (this.scene.builder.isBuildMode() || this.scene.pipeSystem.isDisconnectMode() || this.scene.destroyer.isDestroyMode()) return;
            this.scene.builder.startBuild(Building.SPLITTER);
        });

        $('#buildBalancer').on('click', () => {
            if (this.scene.builder.isBuildMode() || this.scene.pipeSystem.isDisconnectMode() || this.scene.destroyer.isDestroyMode()) return;
            this.scene.builder.startBuild(Building.BALANCER);
        });

        $('#buildCombiner').on('click', () => {
            if (this.scene.builder.isBuildMode() || this.scene.pipeSystem.isDisconnectMode() || this.scene.destroyer.isDestroyMode()) return;
            this.scene.builder.startBuild(Building.COMBINER);
        });

        $('#buildSwitch').on('click', () => {
            if (this.scene.builder.isBuildMode() || this.scene.pipeSystem.isDisconnectMode() || this.scene.destroyer.isDestroyMode()) return;
            this.scene.builder.startBuild(Building.SWITCH);
        });

        $('#buildHeatingPlant').on('click', () => {
            if (this.scene.builder.isBuildMode() || this.scene.pipeSystem.isDisconnectMode() || this.scene.destroyer.isDestroyMode()) return;
            this.scene.builder.startBuild(Building.HEATING_PLANT);
        });

        // pause
        $('#play-icon').on('click', () => {
            this.scene.pause.unpause();
        });
        $('#pause-icon').on('click', () => {
            this.scene.pause.pause();
        });
    }

    update () {
        if (this.scene.pause.isPaused()) {
            $('.paused').show();
            $('#play-icon').show();
            $('#pause-icon').hide();
            $('.pause-icon').attr('class', 'pause-icon mr15 pause');
        } else {
            $('.paused').hide();
            $('#play-icon').hide();
            $('#pause-icon').show();
            $('.pause-icon').attr('class', 'pause-icon mr15 play');
        }
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

    showBuildMode (building: string): void {
        $('#buildingName').html(building);
        $('.actionInfo').show();
        $('.buildingInfo').show();
    }

    hideBuildMode (): void {
        $('.actionInfo').hide();
        $('.buildingInfo').hide();
    }

    showDestroyMode (): void {
        $('.actionInfo').show();
        $('.destroyInfo').show();
    }

    hideDestroyMode (): void {
        $('.actionInfo').hide();
        $('.destroyInfo').hide();
    }

    showSocketOccupied (): void {
        $('.socketOccupied').slideDown();
        setTimeout(() => {
            $('.socketOccupied').slideUp();
        }, 3000);
    }
}
