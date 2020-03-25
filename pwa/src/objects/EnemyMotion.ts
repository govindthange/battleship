import { range } from "rxjs";
import { interval } from 'rxjs';
import { map, mapTo, toArray, flatMap, mergeMap } from "rxjs/operators";
import { Enemy } from "./Enemy"

class EnemyMotion {
    width: number;
    height: number;
    density: number;

    constructor(width: number, height: number, density: number) {
        this.width = width;
        this.height = height;
        this.density = density;
    }

    createEnemy() {

        let point = {
            x: (Math.random() * this.width),
            y: (Math.random() * this.height)
        };

        let temp = (Math.random() * 10 + 1);
        let size =  {width: temp, height: temp};
        let speed = (Math.random() * 3) + 1;
        
        return new Enemy(point, size, speed);
    }

    public subscribe(callback: any) {
        let observable
            = range(1, this.density) // creates a stream of sequential values emitted 
                                     // as per the provided range.
                // 1st transform the sequential-value-steram to a new stream 
                //    where each sequential value is projected as a particle objects.
                // 2nd take the stream of partical object values, 
                //    accumulate all values in a single array object and then create another stream
                //    that just emits that whole array as a single value in the stream.
                .pipe(map(() => this.createEnemy()), toArray())
                .pipe(flatMap((arr: any) => { // flatMap will apply the projection function on 
                                              // each value of its source stream (the single array) 
                                              // and then merge it back to the source stream 
                                              // i.e. the stream/observable created by the toArray() fn.
                    return interval(70) // projection fn, the 1st parameter to flatMap fn, 
                                        // will update array values every 70ms and merge back 
                                        // the updated array to the main arr object, which is 
                                        // a value of the source stream.
                        .pipe(map(()=> { // transform/project each value 
                                         // (which is the whole array, not separate items in it) 
                                         // in the source stream by updating its y coordinate.
                            arr.forEach((e: any) => {
                                if (e.point.y >= this.height) {
                                    e.point.y = 0;
                                }
                                e.point.y += (3 * e.speed);
                            });
                            return arr;
                        }));
                }));

        observable.subscribe((arr: any) => callback(arr));
    }
}

export { EnemyMotion as EnemyMotion };