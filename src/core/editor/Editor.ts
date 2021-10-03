import GameScene from "scenes/GameScene";
import {Layer} from "core/editor/Layer";
import Group = Phaser.GameObjects.Group;
import Image = Phaser.GameObjects.Image;
import GameObject = Phaser.GameObjects.GameObject;
import EditorUI from "core/editor/EditorUI";

declare let __DEV__: any;

export default class Editor {

    private scene: GameScene;
    private layers: { name: string;  depth: number; type: 'images' | 'points'; group: Group}[] = [];
    private isEnabled: boolean = false;

    public lastPickedItem!: GameObject;

    private editorUI!: EditorUI;

    constructor(scene: GameScene) {
        this.scene = scene;

        this.isEnabled = __DEV__;
        // this.isEnabled = false;
        if (this.isEnabled) {
            this.enableEdit();
            this.editorUI = new EditorUI(this, this.scene.datGui.gui);
        }

        this.load();

        setTimeout(() => {
            this.save();
        }, 1000);
    }

    update(): void {
        if (this.editorUI !== undefined) {
            this.editorUI.update();
        }
    }

    public load(): void {

        const rawData = localStorage.getItem('editor');
        if (!rawData) {
            console.info('Editor data not found in localstorage');
            return;
        }

        const data = JSON.parse(rawData) as Layer[];

        for (let layer of data) {
            console.log(`loading layer ${layer.name} with ${layer.objects.length} objects of type ${layer.type}`);
            const layerObject = {
                name: layer.name,
                depth: layer.depth,
                type: layer.type,
                group: this.scene.add.group()
            };

            for (let object of layer.objects) {
                const generatdObject = this.scene.add.image(object.x, object.y, 'assets', object.indexName)
                    .setAngle(object.angle)
                    .setDepth(layer.depth);

                if (this.isEnabled)
                    this.scene.input.setDraggable(generatdObject.setInteractive());

                layerObject.group.add(generatdObject);
            }

            this.layers.push(layerObject);
        }
    }

    public save(): void {
        console.log(this);
        let saveData: Layer[] = [];
        for (let layer of this.layers) {
            saveData.push({
                name: layer.name,
                depth: layer.depth,
                type: layer.type,
                // @ts-ignore
                objects: layer.group.getChildren().map((object: Image): any => {
                    return {
                        x: object.x,
                        y: object.y,
                        angle: object.angle,
                        scaleX: object.scaleX,
                        scaleY: object.scaleY,
                        indexName: object.frame.name
                    };
                })
            });
        }

        const json = JSON.stringify(saveData);
        localStorage.setItem('editor', json);
        console.info('editor saved into local storage');
    }

    private enableEdit(): void {
        this.scene.input.on('pointerdown', () => {
            console.log('click');
        });

        this.scene.input.on('drag', function (pointer, obj, dragX, dragY)
        {
            console.log('drag!');
            obj.setPosition(dragX, dragY);
        });
    }
}
