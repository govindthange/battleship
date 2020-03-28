import { Point } from "../core/Point";
import { merge, fromEvent, interval, of, from } from "rxjs";
import { map, startWith, filter, sample, timestamp, toArray, flatMap} from "rxjs/operators";
import { Size } from "../core/Size";

class Battleship {

    point: Point; 
       
    width: number;

    shotSize: Size;

    canvas: HTMLCanvasElement;
    
    constructor(canvas: HTMLCanvasElement) {

        this.canvas = canvas;

        this.point = {
            x: canvas.width / 2,
            y: canvas.height - 20
        }
        this.width = 20;

        this.shotSize = {width: 3, height: 10};
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

    renderHits(context: any, shot: any, direction: string) {
        context.fillStyle = "yellow";
        context.beginPath();
        context.moveTo(shot.x - this.shotSize.width, shot.y);
        context.lineTo(shot.x, direction === "up" ? shot.y - this.shotSize.height : shot.y + this.shotSize.height);
        context.lineTo(shot.x + this.shotSize.width, shot.y);
        context.lineTo(shot.x - this.shotSize.width, shot.y);
        
        context.fill();
    }

    public streamCoordinates() {
        return fromEvent(this.canvas, "mousemove") // observable of all mousemove values.
                // Transform mousemove-event-stream to coordinate-value-streams.
               .pipe(map((event: MouseEvent) => ({x: event.clientX, y: event.clientY})))
                // Transform coordinate-value-stream by prepending it with a starting coordinate value
               .pipe(startWith({x: this.canvas.width/2, y: this.canvas.height/2}));
   }

   public streamHits() {
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
                .pipe(timestamp())
                ;
    }
}

export { Battleship };