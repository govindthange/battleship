import { fromEvent, pipe } from "rxjs";
import { Battleship } from "./Battleship";
import { map, startWith } from "rxjs/operators";

class BattleshipMotion {

    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public subscribe(callback: any) {
        let observable
            = fromEvent(this.canvas, "mousemove")
                .pipe(map((event: MouseEvent) => ({x: event.clientX, y: event.clientY})))
                .pipe(startWith({x: this.canvas.width/2, y: this.canvas.height/2}));

        observable.subscribe(
            (coord: any) => callback(coord)
        )
    }

}

export { BattleshipMotion };