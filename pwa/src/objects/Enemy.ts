import { Base } from "./Base";

class Enemy extends Base {

    speed: number;
    
    constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number, speed: number) {
        super(canvas, x, y, width, height);
        this.speed = speed;
    }

    public render(context: any, direction: string) {
        super.render(context, "red", direction);
    }
}

export { Enemy };