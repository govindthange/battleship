import { Point } from "../core/Point";
import { Size } from "../core/Size";

class Enemy {

    point: Point;
    size: Size;
    speed: number;
    
    constructor(point: Point, size: Size, speed: number) {
        this.point = point;
        this.size = size;
        this.speed = speed;
    }

    width: number;

    public render(context: any) {
        context.fillStyle = "red";
        context.beginPath();
        context.moveTo(this.point.x - this.size.width, this.point.y);
        context.lineTo(this.point.x, /*direction === "up" ? this.point.y - this.width :*/ this.point.y + this.size.width);
        context.lineTo(this.point.x + this.size.width, this.point.y);
        context.lineTo(this.point.x - this.size.width, this.point.y);
        context.fill();
    }
}

export { Enemy };