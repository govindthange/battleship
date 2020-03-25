import { merge, fromEvent } from "rxjs";
import { filter, sample, timestamp } from "rxjs/operators";

class BattleshipFiring {
    constructor(canvas: HTMLCanvasElement) {
        let observable = merge(
            fromEvent(canvas, "click"),
            fromEvent(document, "keydown")
                .pipe(filter(
                        (evt: any) => { return evt.keyCode === 32;}
                    )
                )
        )
        //.pipe(sample(200))
        .pipe(timestamp());

        observable.subscribe(
            (x) => console.log(x)
        );
    }
}

export { BattleshipFiring };