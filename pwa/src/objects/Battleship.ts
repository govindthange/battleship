import { Point } from "../core/Point";
import { fromEvent, pipe } from "rxjs";
import { map, startWith } from "rxjs/operators";

class Battleship {

    point: Point;    
    width: number;

    canvas: HTMLCanvasElement;
    
    constructor(canvas: HTMLCanvasElement) {

        this.canvas = canvas;

        this.point = {
            x: canvas.width / 2,
            y: canvas.height - 20
        }
        this.width = 20;
    }

    render(context: any, point: Point, direction: string) {

        if (point) {
            this.point.x = point.x;
        }

        context.fillStyle = "green";
        context.beginPath();
        context.moveTo(this.point.x - this.width, this.point.y);
        context.lineTo(this.point.x, direction === "up" ? this.point.y - this.width : this.point.y + this.width);
        context.lineTo(this.point.x + this.width, this.point.y);
        context.lineTo(this.point.x - this.width, this.point.y);
        context.fill();
    }

    public streamCoordinates() {
        return fromEvent(this.canvas, "mousemove") // observable of all mousemove values.
                // Transform mousemove-event-stream to coordinate-value-streams.
               .pipe(map((event: MouseEvent) => ({x: event.clientX, y: event.clientY})))
                // Transform coordinate-value-stream by prepending it with a starting coordinate value
               .pipe(startWith({x: this.canvas.width/2, y: this.canvas.height/2}));
   }
}

export { Battleship };