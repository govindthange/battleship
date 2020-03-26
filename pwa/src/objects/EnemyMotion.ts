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
}

export { EnemyMotion as EnemyMotion };