import Editor from "core/editor/Editor";
import {GUI} from "dat.gui";

export default class EditorUI {

    private editor: Editor;
    private datGui: GUI;

    constructor(editor: Editor, datGui: GUI) {
        this.editor = editor;
        this.datGui = datGui;

        this.initDatGUI();
    }

    update(): void {
        console.log('update');
    }

    redraw(): void {

    }

    private initDatGUI(): void {
        let folder2 = this.datGui.addFolder('EDITOR');

        let obj = {saveEditor: this.editor.save.bind(this.editor)};
        folder2.add(obj, 'saveEditor');
    }
}
