import GameConfig from 'config/GameConfig';
import { Building } from 'enums/Building';
import { Depths } from 'enums/Depths';
import { SocketType } from 'enums/SocketType';
import $ from 'jquery';
import GameScene from 'scenes/GameScene';
import DayNightUI from 'ui/DayNightUI';

export default class UI {

    private scene: GameScene;
    private dayNightUI: DayNightUI;
    private helpScreen: Phaser.GameObjects.Image;
    private helpBlackScreenAlpha: Phaser.GameObjects.Rectangle;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.dayNightUI = new DayNightUI(this.scene);

        this.helpBlackScreenAlpha = this.scene.add.rectangle(0, 0, GameConfig.World.size.width, GameConfig.World.size.height, 0x000000, 0.55)
            .setDepth(Depths.HELP)
            .setOrigin(0)
            .setVisible(false);
        this.helpScreen = this.scene.add.image(GameConfig.World.size.width / 2., GameConfig.World.size.height / 2, 'help_screen')
            .setDepth(Depths.HELP)
            .setVisible(false);

        $('#cancelSocket').on('click', () => {
            this.scene.pipeSystem.cancelConnecting();
        });

        $('.helpButton').on('click', () => {
            if (this.helpBlackScreenAlpha.visible) {
                this.hideHelp() ;
            } else {
                this.showHelp();
            }
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
                $('.showAllInside').html('<i class="fas fa-eye"></i>');
                this.scene.pipeSystem.stopShowAllMode();
            } else {
                $('.showAllInside').html('<i class="fas fa-eye-slash"></i>');
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
        $('.playAction').on('click', () => {
            this.scene.pause.unpause();
        });
        $('.pauseAction').on('click', () => {
            this.scene.pause.pause();

        });
        $('.forwardAction').on('click', () => {
            this.scene.pause.runFastForward();
        });

        this.show();
    }

    update () {
        if (this.scene.pause.isPaused()) {
            $('.paused').show();
            $('#play-icon').show();
            $('#pause-icon').hide();
            $('.pause-icon').attr('class', 'pause-icon mr15 pause');
        } else {
            this.dayNightUI.update();
            $('#moneyAmount').html(this.scene.money);
            $('.paused').hide();
            $('#play-icon').hide();
            $('#pause-icon').show();
            $('.pause-icon').attr('class', 'pause-icon mr15 play');
        }
    }

    show (): void {
        $('.ingame-ui').show();
    }

    hide (): void {
        $('.ingame-ui').hide();
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

    showHelp (): void {
        this.helpBlackScreenAlpha.setVisible(true);
        this.helpScreen.setVisible(true);
        this.hide();
        this.scene.pause.pause();
    }

    hideHelp (): void {
        this.helpBlackScreenAlpha.setVisible(false);
        this.helpScreen.setVisible(false);
        this.show();
        this.scene.pause.unpause();
    }
}
