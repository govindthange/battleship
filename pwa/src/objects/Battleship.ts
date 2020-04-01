import { Base } from "../core/Base";
import { merge, fromEvent, interval, from } from "rxjs";
import { map, startWith, filter, sample, timestamp, scan, debounceTime } from "rxjs/operators";
import { Shape } from "./Shape";

class Battleship extends Base {

    isDestroyed: boolean;
    image: any;
    crashImage: any;
    
    constructor(canvas: HTMLCanvasElement) {
        super(
              canvas,
              canvas.width / 2,
              canvas.height - 20,
              80,
              80);

        this.image = new Image();
        this.image.src = "/images/spaceship.svg";

        this.crashImage = new Image();
        this.crashImage.src = "/images/spaceship-crashed.svg";
    }

    render(newLocation: any) {

        let image = this.image;

        if (this.isDestroyed) {
            image = this.crashImage;
        }
        else {
            this.x = newLocation.x;
        }
        
        this.context.drawImage(image, this.x - 40, this.y - 60, this.width, this.height);
    }

    renderProjectile(shot: any) {
        Shape.drawTriangle(this.context, "yellow", shot.x, shot.y - 45, shot.width, shot.height, "up");
    }

    public streamCoordinates() {
        return merge(this.streamMouseMoves(), this.streamKeyStrokes())
                .pipe(scan(
                    (acc: any, obj: any) => {
                        //console.log("acc: %o, obj: %o", acc, obj);
                        if (obj.event === "mousemove") {
                            acc.x = obj.x;
                            acc.y = obj.y - 45;
                        }
                        else if (obj.event === "keydown"){
                            acc.x += obj.x;
                            acc.y += obj.y - 45;
                        }
                        //console.log("accumuating %o", acc);
                    return acc;
                }, {x: this.x, y: this.y}));
    }

    streamMouseMoves() {
        return fromEvent(this.canvas, "mousemove") // observable of all mousemove values.
                // Transform mousemove-event-stream to coordinate-value-streams.
               .pipe(map((event: MouseEvent) => ({x: event.clientX, y: event.clientY, event: "mousemove"})))
               // Transform coordinate-value-stream by prepending it with a starting coordinate value
               .pipe(startWith({x: this.canvas.width/2, y: this.canvas.height/2, event: "mousemove"}));
   }

   streamKeyStrokes() {
       return fromEvent(document, "keydown")
                .pipe(filter((evt: any) => { return evt.keyCode ===37 || evt.keyCode === 39 }))
                .pipe(map((evt: any) => {
                    switch(evt.keyCode) {
                        case 37:
                            return {x: -3, y:0, event: "keydown"};
                        case 39:
                            return {x: 3, y: 0, event: "keydown"};
                        default:
                            return {x: 0, y: 0, event: "keydown"};
                    }
                }))
                .pipe(startWith({x: 0, y: 0, event: "keydown"}));
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