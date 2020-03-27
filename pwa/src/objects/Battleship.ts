import { Point } from "../core/Point";
import { merge, fromEvent, interval, of, from } from "rxjs";
import { map, startWith, filter, sample, timestamp, toArray, flatMap} from "rxjs/operators";
import { Size } from "../core/Size";

class Battleship {

    point: Point;    
    width: number;

    shots: { point: Point; size: Size;}[];

    canvas: HTMLCanvasElement;
    
    constructor(canvas: HTMLCanvasElement) {

        this.shots = [];

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

    renderHits(context: any, shipShots: any, direction: string) {
        let width =45;

        if (shipShots.value == null) {
            shipShots = [];
        }

        context.fillStyle = "yellow";
        context.beginPath();

        shipShots.value.forEach((shotObj: any) => {
            let shot = shotObj.point;
            //console.log(shot);

            context.moveTo(shot.x - width, shot.y);
            context.lineTo(shot.x, /*direction === "up" ?*/ shot.y - width /*: shot.y + width*/);
            context.lineTo(shot.x + width, shot.y);
            context.lineTo(shot.x - width, shot.y);
        })
        
        context.fill();
    }

    public streamCoordinates() {
        return fromEvent(this.canvas, "mousemove") // observable of all mousemove values.
                // Transform mousemove-event-stream to coordinate-value-streams.
               .pipe(map((event: MouseEvent) => ({x: event.clientX, y: event.clientY})))
                // Transform coordinate-value-stream by prepending it with a starting coordinate value
               .pipe(startWith({x: this.canvas.width/2, y: this.canvas.height/2}));
   }

   shoot(): { point: Point; size: Size;}[] {
        let shot = { point: {x: 0, y: 0}, size: { width: 0, height: 0}};
        shot.point.x = this.point.x;
        shot.point.y = this.point.y;
        shot.size = {width: 10, height: 10};

        this.shots = this.shots.filter((shot) => shot.point.y > 0);
        this.shots.push (shot);

        console.log(this.shots.length);
        return this.shots;
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
                .pipe(map((event: any) => this.shoot()), toArray())
                .pipe(flatMap((arr: any) => { // flatMap will apply the projection function on each value of
                                              // its source stream (the o/p of toArray() => 'arr' argument) 
                                              // and then merge it back to the source stream 
                                              // i.e. the stream/observable created by the toArray() fn.
                    return interval(1000)
                            .pipe(map(() => { // transform/project each value 
                                              // (which is the whole array, not separate items in it) 
                                              // in the source stream by updating its y coordinate.
                                arr = arr.filter((s:any) => s.point.y > 0)                                
                                arr.forEach((shot: any) => {
                                    console.log(shot.point.y);
                                    shot.point.y -= 10;
                                });
                                return arr;
                            }));
                    })
                )
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