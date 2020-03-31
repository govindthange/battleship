import { Shape } from "../objects/Shape";

class Base {
    x: number;
    y: number;
    width: number;
    height: number;

    canvas: HTMLCanvasElement;
    context: any;

    constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public render(color: any, direction: string) {
        Shape.drawTriangle(this.context, color, this.x, this.y, this.width, this.height, direction);
    }
}

export { Base };