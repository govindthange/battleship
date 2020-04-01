import { Base } from "./Base";

class Util {
    static random(max: number): number {
        return this.randomRange(0, max);
    }

    static randomRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomBoolean(): boolean {
        return this.randomRange(0, 1) == 0;
    }

    static didPointsOverlap(obj1: Base, obj2: Base, impact: number) {
        return (obj1.x > obj2.x - impact && obj1.x < obj2.x + impact) && (obj1.y > obj2.y - impact && obj1.y < obj2.y + impact);
    }

    static didObjectOverlap(obj1: Base, obj2: Base, swap = true): boolean {
        return Util.didOverlap(obj1, obj2) || Util.didOverlap(obj2, obj1);
    }

    static didOverlap(obj1: Base, obj2: Base): boolean {
        let xAxisOverlap: boolean = obj1.x <= obj2.x  && obj1.x + obj1.width >= obj2.x;
        let yAxisOverlap: boolean = obj1.y - obj1.height <= obj2.y && obj1.y >= obj2.y;
        return xAxisOverlap && yAxisOverlap;
    }
}

export { Util };