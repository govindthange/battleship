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
            = range(1, this.density)
                .pipe(map(() => this.createEnemy()), toArray())
                .pipe(flatMap((arr: any) => {
                    return interval(70)
                        .pipe(map(()=> {
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