import GameScene from "scenes/GameScene";
import {Layer} from "core/editor/Layer";
import Group = Phaser.GameObjects.Group;
import Image = Phaser.GameObjects.Image;
import GameObject = Phaser.GameObjects.GameObject;
import EditorUI from "core/editor/EditorUI";
import world from 'core/editor/world.json';
import Building from "entity/Building";
declare let __DEV__: any;

export default class Editor {

    public static readonly LOAD_FROM_LOCAL_STORAGE = false;
    public static readonly ALLOWED_OBJECTS = [
        'road_vertical',
        'factory1',
        'factory2',
        'factory3',
        'heating_plant',
        'house',
        'house_large',
        'tree1',
        'tree2',
        'tree_group',
        'tree_large1'
    ];

    private scene: GameScene;
    public layers: { name: string;  depth: number; type: 'images' | 'points'; group: Group}[] = [];
    private isEnabled: boolean = false;

    public lastPickedItem!: GameObject;
    public pickedLayer: string = '';

    private editorUI!: EditorUI;

    constructor(scene: GameScene) {
        this.scene = scene;

        this.isEnabled = __DEV__;
        this.load();
        // this.isEnabled = false;
        if (this.isEnabled) {
            this.enableEdit();
            this.editorUI = new EditorUI(this, this.scene.datGui.gui);
        }

    }

    update(): void {
        if (this.editorUI !== undefined) {
            this.editorUI.update();
        }
    }

    public load(): void {
        let data;
        if (Editor.LOAD_FROM_LOCAL_STORAGE) {
            const rawData = localStorage.getItem('editor');
            if (!rawData) {
                console.info('Editor data not found in localstorage');
                return;
            }
            data = JSON.parse(rawData) as Layer[];
        } else {
            data = world;
        }

        for (let layer of data) {
            console.log(`loading layer ${layer.name} with ${layer.objects.length} objects of type ${layer.type}`);
            const layerObject = {
                name: layer.name,
                depth: layer.depth,
                type: layer.type,
                group: this.scene.add.group()
            };

            for (let object of layer.objects) {

                const generatedObject = this.createObject(
                    layer.name,
                    layer.depth,
                    object.indexName,
                    object.x,
                    object.y,
                    object.angle,
                    object.scaleX,
                    object.scaleY,
                    object.originX,
                    object.originY
                );

                layerObject.group.add(generatedObject);
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
                    let frameName;
                    try {
                        // @ts-ignore
                        frameName = object.getFrameName();
                    } catch (e) {
                        frameName = object.frame.name;
                    }

                    return {
                        x: object.x,
                        y: object.y,
                        angle: object.angle,
                        scaleX: object.scaleX,
                        scaleY: object.scaleY,
                        originX: object.originX,
                        originY: object.originY,
                        indexName: frameName
                    };
                })
            });
        }

        const json = JSON.stringify(saveData);
        localStorage.setItem('editor', json);
        console.info('editor saved into local storage');
    }

    public placeObject(): void {
        if (this.pickedLayer === undefined) {
            console.error('editor layer not picked');
            return;
        }

        let foundLayer = this.layers.find((layer) => {
            return layer.name === this.pickedLayer;
        });

        if (!foundLayer) {
            console.info('layer ' + this.pickedLayer + ' not found');
            return;
        }

        const image = this.editorUI.placeObjectType;
        console.info('editor place object ' + image + ' into layer ' + this.pickedLayer);

        let object = this.createObject(this.pickedLayer,foundLayer.depth, image, 100, 100);
        foundLayer.group.add(object);
        this.editorUI.redraw();
    }

    public deleteObject(): void {
        if (this.lastPickedItem === undefined) {
            console.error('can not delete object, becuase no selected');
            return;
        }

        this.lastPickedItem.destroy(true);
        // @ts-ignore
        this.lastPickedItem = undefined;
        this.editorUI.redraw();
    }

    public duplicateObject(): void {
        if (this.lastPickedItem === undefined) {
            console.error('can not delete object, becuase no selected');
            return;
        }
        if (this.pickedLayer === undefined) {
            console.error('editor layer not picked');
            return;
        }
        let foundLayer = this.layers.find((layer) => {
            return layer.name === this.pickedLayer;
        });

        if (!foundLayer || foundLayer === undefined) {
            console.info('layer ' + this.pickedLayer + ' not found');
            return;
        }

        // @ts-ignore
        const image = this.lastPickedItem.frame.name;
        console.info('editor duplicate object ' + image + ' into layer ' + this.pickedLayer);
        console.info(`editor duplicate object ${image} into layer ${this.pickedLayer} on ${image.x},${image.y}`);

        // @ts-ignore
        let object = this.createObject(this.pickedLayer, foundLayer.depth, image, this.lastPickedItem.x, this.lastPickedItem.y, this.lastPickedItem.angle, this.lastPickedItem.scaleX, this.lastPickedItem.scaleY, this.lastPickedItem.originX, this.lastPickedItem.originY);
        foundLayer.group.add(object);
        this.editorUI.redraw();
    }

    public createLayer(name: string, depth: number): void {
        this.layers.push({
            name: name,
            depth: depth,
            type: 'images',
            group: this.scene.add.group()
        });

        this.editorUI.redraw();
    }

    public getAllLayersNames(): string[]
    {
        return this.layers.map((layer) => {
            return layer.name;
        });
    }

    public deleteLayer(): void {
        const name = prompt('name of layer to delete');
        if (!name) {
            console.error('name of layer not given');
            return;
        }

        const foundLayer = this.layers.find((layer) => {
            return name === layer.name;
        });

        if (!foundLayer || foundLayer === undefined) {
            console.error('layer not foudn');
            return;
        }

        const indexOf = this.layers.indexOf(foundLayer);
        if (indexOf === -1) {
            console.error('layer not found 2');
        }

        foundLayer.group.destroy();
        this.layers.splice(indexOf, 1);

        this.editorUI.redraw();
    }

    private enableEdit(): void {
        this.scene.input.on('pointerdown', () => {
            console.log('click');
        });

        this.scene.input.on('drag', (pointer, obj, dragX, dragY) => {
            console.log('drag!');
            obj.setPosition(dragX, dragY);
        });

        this.scene.input.on('dragend', (pointer, obj) => {
            console.log('drag end!');
            this.lastPickedItem = obj;
            this.editorUI.redraw();
        });
    }

    private createObject(layer: string, depth: number, index: string, x: number, y: number, angle: number = 0, scaleX: number = 1, scaleY: number = 1, originX: number = 0.5, originY: number = 0.5): GameObject {
        let object;

        if (layer === 'buildings' || layer === 'factories') {
        // if (false) {
            object = new Building(this.scene, x, y, index);
        } else {
            object = this.scene.add.image(x, y, 'assets', index)
                .setScale(scaleX, scaleY)
                .setOrigin(originX, originY)
                .setAngle(angle)
                .setDepth(depth);

            if (this.isEnabled) {
                this.scene.input.setDraggable(object.setInteractive());
            }
        }
        return object;
    }
}
