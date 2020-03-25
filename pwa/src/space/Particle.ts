import { Point } from "../core/Point";
import { Size } from "../core/Size";

class Particle {

    point: Point;
    size: Size;
    
    constructor(point: Point, size: Size) {
        this.point =  point;
        this.size = size;
    }

    width: number;

    public render(context: any) {
        context.fillStyle = "#ffffff";
        context.fillRect(this.point.x, this.point.y, this.size.width, this.size.height)
    }
}

export { Particle };