import { Base } from "../core/Base";
import { Util } from "../core/Util";
import { interval } from "rxjs";
import { scan } from "rxjs/operators";

const AIRCRAFT_MAX_SPEED: number = 9;
const AIRCRAFT_DISPATCH_RATE: number = 2000; // Prepare 1 aircraft for attack every 1500ms

class Aircraft extends Base {

    speed: number;
    color: string;
    isDestroyed: boolean;
    fallDirection: number = 0;
    
    constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number, speed: number) {
        super(canvas, x, y, width, height);
        this.speed = speed;
        this.color = "red";
        this.isDestroyed = false;
    }

    public render() {
        if (this.isDestroyed) {
            this.color = "gray";
            this.speed = 3;

            if (this.fallDirection == 0) {
                this.fallDirection = Util.randomBoolean() ? 1 : -1;
            }

            this.x += this.fallDirection * this.speed;
        }

        super.render(this.color, "down");
    }
}

class Fleet extends Base {
    
    constructor(canvas: HTMLCanvasElement) {
        super(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height);
    }

    dispatchAircraft(canvas: HTMLCanvasElement) {
        let x = Util.random(this.width),
            y = -25,
            width = Util.randomRange(1, 10),
            height = Util.randomRange(1, 10); 

        let speed = AIRCRAFT_MAX_SPEED / Util.randomRange(1, 3);
        
        return new Aircraft(canvas, x, y, width, height, speed);
    }

    public streamCoordinates() {
        return interval(AIRCRAFT_DISPATCH_RATE)
        //return fromEvent(document, "keydown")
                .pipe(scan((enemies: any) => {
                    enemies = enemies.filter((e: any) => e.y < this.height);
                    enemies.push(this.dispatchAircraft(this.canvas));
                    return enemies;
                }, []))
    }

}

export { Aircraft, Fleet };