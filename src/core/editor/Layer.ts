export interface Layer {
    name: string;
    depth: number;
    type: 'images' | 'points';
    objects: {
        x: number;
        y: number;
        angle: number;
        scaleX: number;
        scaleY: number;
        indexName: string;
    }[];
}
