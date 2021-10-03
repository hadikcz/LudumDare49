import Editor from "core/editor/Editor";
import {GUI, GUIController} from "dat.gui";

export default class EditorUI {

    private editor: Editor;
    private datGui: GUI;
    private folderObject!: GUI;
    private itemFolder!: GUI;

    public placeObjectType: string = '';

    private layerSelector!: GUIController;
    private folderLayers!: GUI;
    private folderLayersSub!: GUI;
    private folderObjectCreation!: GUI;

    constructor(editor: Editor, datGui: GUI) {
        this.editor = editor;
        this.datGui = datGui;

        this.initDatGUI();
    }

    update(): void {
        console.log('update');
    }

    redraw(): void {
        if (this.editor.lastPickedItem !== undefined) {
            if (this.itemFolder !== undefined) {
                this.folderObject.removeFolder(this.itemFolder);
            }

            this.itemFolder = this.folderObject.addFolder('item');
            this.itemFolder.open();
            this.folderObject.open();

            // @ts-ignore
            if (this.editor.lastPickedItem.frame !== undefined) {
                // @ts-ignore
                this.itemFolder.add(this.editor.lastPickedItem.frame, 'name');
            }
            this.itemFolder.add(this.editor.lastPickedItem, 'x').listen();
            this.itemFolder.add(this.editor.lastPickedItem, 'y').listen();
            this.itemFolder.add(this.editor.lastPickedItem, 'angle').listen();
            this.itemFolder.add(this.editor.lastPickedItem, 'scaleX').listen();
            this.itemFolder.add(this.editor.lastPickedItem, 'scaleY').listen();
            this.itemFolder.add(this.editor.lastPickedItem, 'originX').listen();
            this.itemFolder.add(this.editor.lastPickedItem, 'originY').listen();
        }

        // this.layerSelector.options(this.editor.getAllLayersNames());
        this.createLayerSelector();
        this.createListOfLayers();
    }

    private initDatGUI(): void {
        let folder2 = this.datGui.addFolder('EDITOR');
        folder2.open();

        const obj3 = {worldLoadedFromLocalStorage: Editor.LOAD_FROM_LOCAL_STORAGE};
        folder2.add(obj3, 'worldLoadedFromLocalStorage');

        let obj2 = {saveEditor: this.editor.save.bind(this.editor)};
        folder2.add(obj2, 'saveEditor');

        ///////
        this.folderObjectCreation = folder2.addFolder('Object creation');
        this.folderObjectCreation.open();
        let obj = {placeObject: this.editor.placeObject.bind(this.editor)};
        this.folderObjectCreation.add(obj, 'placeObject');

        this.folderObjectCreation.add(this, 'placeObjectType', Editor.ALLOWED_OBJECTS).listen();

        this.createLayerSelector();

        //////
        this.folderLayers = folder2.addFolder('Layers');
        this.folderLayers.open();

        this.createListOfLayers();

        this.folderObject = this.datGui.addFolder('EDITOR - picked object');
    }

    private createListOfLayers(): void {
        try {
            this.folderLayers.removeFolder(this.folderLayersSub);
            this.folderLayersSub.destroy();
        } catch(e){}
        this.folderLayersSub = this.folderLayers.addFolder('X');
        this.folderLayersSub.open();

        if (this.folderLayers === undefined) return;
        for (let layer of this.editor.layers) {
            this.folderLayersSub.add(layer, 'name').listen();
            this.folderLayersSub.add(layer, 'depth').listen();
            this.folderLayersSub.add(layer, 'type').listen();

        }

        let createLayer = {createLayer: this.createLayerUI.bind(this)};
        this.folderLayersSub.add(createLayer, 'createLayer');
        let deleteLayer = {deleteLayer: this.editor.deleteLayer.bind(this.editor)};
        this.folderLayersSub.add(deleteLayer, 'deleteLayer');
    }

    private createLayerUI(): void {
        const layerName = prompt('Give layer name');
        if (layerName === null) {
            console.error('name not given');
            return;
        }
        const depth = prompt('Depth');
        if (depth === null) {
            console.error('depth not given');
            return;
        }

        this.editor.createLayer(layerName, parseInt(depth));

        this.redraw();
    }

    private createLayerSelector(): void {
        if (this.layerSelector !== undefined) {
            this.layerSelector.remove();
        }

        this.placeObjectType = '';
        this.layerSelector = this.folderObjectCreation.add(this.editor, 'pickedLayer', this.editor.getAllLayersNames()).listen();
    }
}
