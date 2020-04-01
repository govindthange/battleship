import { Base } from "../core/Base";
import { Util } from "../core/Util";
import { interval } from "rxjs";
import { scan, map } from "rxjs/operators";
import { Shape } from "./Shape";

const AIRCRAFT_MAX_SPEED: number = 6;
const AIRCRAFT_DISPATCH_RATE: number = 2000; // Prepare 1 aircraft for attack every 2000ms

class Aircraft extends Base {

    speed: number;
    isDestroyed: boolean;
    fallDirection: number = 0;

    projectiles: any;
    image: any;
    crashImage: any;
    
    constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number, speed: number) {
        super(canvas, x, y, width, height);
        this.speed = speed;
        this.isDestroyed = false;

        this.projectiles = [];
        this.image = new Image();
        this.image.src = "/images/navicella-spaziale.svg";
        this.crashImage = new Image();
        this.crashImage.src = "/images/navicella-spaziale-crashed.svg";
    }

    public render() {

        let image = this.image
        if (this.isDestroyed) {
            this.speed = 3;

            if (this.fallDirection == 0) {
                this.fallDirection = Util.randomBoolean() ? 1 : -1;
            }

            this.x += this.fallDirection * this.speed;
            image = this.crashImage;
        }

        this.context.drawImage(image, this.x - 35, this.y - 50, this.width, this.height);
        this.projectiles.forEach((p: any) => {
            Shape.drawTriangle(this.context, "orange", p.x, p.y, p.width, p.height, "down");
        })
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
            width = 60,
            height = width;

        let speed = AIRCRAFT_MAX_SPEED / Util.randomRange(1, 3);
        
        return new Aircraft(canvas, x, y, width, height, speed);
    }

    public streamCoordinates() {
        return interval(AIRCRAFT_DISPATCH_RATE)
        //return fromEvent(document, "keydown")
                .pipe(scan((enemies: any) => {
                    enemies = enemies.filter((e: any) => e.y < this.height);

                    let enemy = this.dispatchAircraft(this.canvas);
                    
                    interval(1500)
                        .subscribe(() => {
                            enemy.projectiles = enemy.projectiles.filter((p: any) => p.y < this.canvas.height);
                            if (!enemy.isDestroyed) {
                                enemy.projectiles.push({x: enemy.x - 4, y: enemy.y - 17, width: 2, height: 5});
                            }
                        })

                    enemies.push(enemy);
                    return enemies;
                }, []))
    }
}

export { Aircraft, Fleet };