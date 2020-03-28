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

    static didPointsOverlap(obj1: Base, obj2: Base, swap = true) {
        return (obj1.x > obj2.x - 20 && obj1.x < obj2.x + 20) && (obj1.y > obj2.y - 20 && obj1.y < obj2.y + 20);
    }

    static didObjectOverlap(obj1: Base, obj2: Base, swap = true): boolean {
        let xAxisOverlap: boolean = obj1.x - obj1.width <= obj2.x + obj2.width && obj1.x + obj1.width >= obj2.x - obj2.width;
        console.log("%s, [ %s, %s ]   [ %s, %s ] |  %s <= %s && %s >= %s", xAxisOverlap, obj1.x, obj1.y, obj2.x, obj2.y, (obj1.x - obj1.width), (obj2.x + obj2.width), (obj1.x + obj1.width), (obj2.x - obj2.width));
        
        let yAxisOverlap: boolean = obj1.y + obj1.height >= obj2.y - obj2.height && obj1.y - obj1.height <= obj2.y + obj2.height;
        console.log("%s, [ %s, %s ]   [ %s, %s ] |  %s >= %s && %s <= %s", (yAxisOverlap), obj1.x, obj1.y, obj2.x, obj2.y, (obj1.y + obj1.height), (obj2.y - obj2.height), (obj1.y - obj1.height), (obj2.y + obj2.height));

        return xAxisOverlap && yAxisOverlap;
    }
}

export { Util };