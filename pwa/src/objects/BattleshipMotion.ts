import { fromEvent, pipe } from "rxjs";
import { map, startWith } from "rxjs/operators";

class BattleshipMotion {

    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public subscribe(callback: any) {
        let observable
            = fromEvent(this.canvas, "mousemove") // observable of all mousemove values.
                 // Transform mousemove-event-stream to coordinate-value-streams.
                .pipe(map((event: MouseEvent) => ({x: event.clientX, y: event.clientY})))
                 // Transform coordinate-value-stream by prepending it with a starting coordinate value
                .pipe(startWith({x: this.canvas.width/2, y: this.canvas.height/2}));

        observable.subscribe(
            (coord: any) => callback(coord)
        )
    }
}

export { BattleshipMotion };