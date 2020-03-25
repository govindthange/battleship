import { merge, fromEvent, interval } from "rxjs";
import { filter, sample, timestamp } from "rxjs/operators";

class BattleshipFiring {
    constructor(canvas: HTMLCanvasElement) {
        let observable = merge( // combine streams of click events and spacebar hit events
            fromEvent(canvas, "click"), // observable stream of all click vlaues
            fromEvent(document, "keydown") // observable stream of all keydown values
                .pipe(filter( // take keydown observable with values of anykeys 
                              // and output observable with spacebar hit values
                        (evt: any) => { return evt.keyCode === 32;}
                    )
                )
        )
        // user operators to convert i/p observable/stream to another o/p observable/stream.
        // user pipe() to work with operators.
        // sample() will throttle the source stream to slowly emit values (1 every 200ms)
        .pipe(sample(interval(200)))
        // timestamp() will create a new stream that return timestamp along with the values of source observable
        .pipe(timestamp());

        observable.subscribe(
            (x) => console.log(x)
        );
    }
}

export { BattleshipFiring };