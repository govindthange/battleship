import { range } from "rxjs";
import { interval } from 'rxjs';
import { map, mapTo, toArray, flatMap, mergeMap } from "rxjs/operators";
import { Particle } from "./Particle"

class ParticleMotion {
    width: number;
    height: number;
    density: number;

    constructor(width: number, height: number, density: number) {
        this.width = width;
        this.height = height;
        this.density = density;
    }

    produce() {
        return new Particle({
                x: (Math.random() * this.width),
                y: (Math.random() * this.height),
                size: (Math.random() * 3 + 1) 
            });
    }

    public subscribe(callback: any) {
        let observable 
            = range(1, this.density)
                .pipe(map(() => this.produce()), toArray())
                .pipe(flatMap((arr: any) => {
                    return interval(100)
                        .pipe(map(()=> {
                            arr.forEach((item: any) => {
                                if (item.y >= this.height) {
                                    item.y = 0;
                                }
                                item.y += 3;
                            });
                            return arr;
                        }));
                }));

        observable.subscribe((arr: any) => callback(arr));
    }
}

export { ParticleMotion as ParticleMotion };