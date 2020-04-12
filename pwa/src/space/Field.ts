import { Particle } from "./Particle";
import { Util } from "../core/Util";
import { Battleship } from "../objects/Battleship";
import { Fleet, Aircraft } from "../objects/Fleet";
import { combineLatest, interval, range } from "rxjs";
import { map, toArray, flatMap, sample, scan, distinctUntilKeyChanged } from "rxjs/operators";
import { Base } from "../core/Base";

const STAR_COUNT = 140

class Field extends Base {
    width: number;
    height: number;
    totalStars: number;
    totalEnemies: number;
    
    canvas: HTMLCanvasElement;
    context: any;

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        super(canvas, 0, 0, width, height);
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
    }

    public render() {
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.width, this.height);
    }

    public renderScore(score: number) {
        this.context.fillStyle = "#ffffff";
        this.context.font = "bold 18px sans-serif";
        this.context.fillText("Score: " + score, 15, 20);
    }

    public streamStarCoordinates() {
        return range(1, STAR_COUNT) // creates a stream of sequential values emitted 
                                    // as per the provided range.
                // 1st transform the sequential-value-stream to a new stream 
                //    where each sequential-value is changed to a particle-object and then projected.
                // 2nd take this new stream of partical-object-values,
                //    accumulate all values in a single array object (toArray() operator) and then 
                //    create another stream that just emits 'the whole array' as a single value in the stream.
                .pipe(map(() => Particle.CreateParticleWithinFrame(this.canvas, this.width, this.height)), toArray())
                .pipe(flatMap((arr: any) => { // flatMap will apply the projection function on each value of
                                              // its source stream (the o/p of toArray() => 'arr' argument) 
                                              // and then merge it back to the source stream 
                                              // i.e. the stream/observable created by the toArray() fn.
                    return interval(90)
                        .pipe(map(() => { // transform/project each value 
                                          // (which is the whole array, not separate items in it) 
                                          // in the source stream by updating its y coordinate.
                            arr.forEach((p: any) => {
                                if (p.y >= this.height) {
                                    p.y = 0;
                                }
                                p.y += 3;
                            });
                            return arr;
                        }));
                }));
    }
}

export { Field };