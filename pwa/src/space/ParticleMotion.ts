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

    createParticle() {

        let point = {
            x: (Math.random() * this.width),
            y: (Math.random() * this.height)
        };

        let temp = (Math.random() * 3 + 1);
        let size =  {width: temp, height: temp};
        
        return new Particle(point, size);
    }

    public subscribe(callback: any) {
        let observable 
            = range(1, this.density)
                .pipe(map(() => this.createParticle()), toArray())
                .pipe(flatMap((arr: any) => {
                    return interval(100)
                        .pipe(map(()=> {
                            arr.forEach((p: any) => {
                                if (p.point.y >= this.height) {
                                    p.point.y = 0;
                                }
                                p.point.y += 3;
                            });
                            return arr;
                        }));
                }));

        observable.subscribe((arr: any) => callback(arr));
    }
}

export { ParticleMotion as ParticleMotion };