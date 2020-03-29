import { Base } from "../core/Base";
import { merge, fromEvent, interval } from "rxjs";
import { map, startWith, filter, sample, timestamp } from "rxjs/operators";

class Battleship extends Base {
    
    constructor(canvas: HTMLCanvasElement) {
        super(
              canvas,
              canvas.width / 2,
              canvas.height - 20,
              20,
              20);
    }

    render(context: any, newLocation: any, direction: string) {
        this.x = newLocation.x;
        super.render(context, "green", direction);
    }

    renderProjectile(context: any, shot: any, direction: string) {
        this.drawTriangle(context, "yellow", shot.x, shot.y, shot.width, shot.height, direction);
    }

    public streamCoordinates() {
        return fromEvent(this.canvas, "mousemove") // observable of all mousemove values.
                // Transform mousemove-event-stream to coordinate-value-streams.
               .pipe(map((event: MouseEvent) => ({x: event.clientX, y: event.clientY})))
               // Transform coordinate-value-stream by prepending it with a starting coordinate value
               .pipe(startWith({x: this.canvas.width/2, y: this.canvas.height/2}));
   }

   public streamProjectiles() {
        return merge( // combine streams of click events and spacebar hit events
                fromEvent(this.canvas, "click"), // observable stream of all click vlaues
                fromEvent(document, "keydown") // observable stream of all keydown values
                    .pipe(filter( // take keydown observable with values of anykeys 
                                // and output observable with spacebar hit values
                            (evt: any) => { return evt.keyCode === 32;}
                        )
                    )
                )
                // Add a void object in the beginning otherwise the combineLatest()
                // operator, which works best with long living streams only, fails to emit values
                // and expects at least one click before it can start yielding latest values.
                .pipe(startWith({}))
                // use operators to convert i/p observable/stream to another o/p observable/stream.
                // use pipe() to work with operators.
                // sample() will throttle the source stream to slowly emit values (1 every 200ms)
                .pipe(sample(interval(200)))
                // timestamp() will create a new stream that return timestamp along with the values of source observable
                .pipe(timestamp());
    }
}

export { Battleship };