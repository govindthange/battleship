import { Base } from "../core/Base";
import { Util } from "../core/Util";
import { interval } from "rxjs";
import { scan } from "rxjs/operators";
import { Shape } from "./Shape";

const AIRCRAFT_MAX_SPEED: number = 6;
const AIRCRAFT_DISPATCH_RATE: number = 2000; // Prepare 1 aircraft for attack every 2000ms

class Aircraft extends Base {

    speed: number;
    color1: string;
    color2: string;
    isDestroyed: boolean;
    fallDirection: number = 0;
    
    constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number, speed: number) {
        super(canvas, x, y, width, height);
        this.speed = speed;
        this.color1 = "#0AFAF3";
        this.color2 = "#5B92FA";
        this.isDestroyed = false;
    }

    public render() {
        if (this.isDestroyed) {
            this.color1 = "#11473C";
            this.color2 = "#444E61";
            this.speed = 3;

            if (this.fallDirection == 0) {
                this.fallDirection = Util.randomBoolean() ? 1 : -1;
            }

            this.x += this.fallDirection * this.speed;
        }

        Shape.drawAircraft(this.context, this.color1, this.color2, this.x, this.y, this.width, this.height, "down");
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
            width = Util.randomRange(4, 7),
            height = width;

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