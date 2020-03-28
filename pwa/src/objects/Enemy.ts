import { Base } from "../core/Base";
import { Util } from "../core/Util";

class Enemy extends Base {

    speed: number;
    color: string;
    isDestroyed: boolean;
    fallDirection: number = 0;
    
    constructor(x: number, y: number, width: number, height: number, speed: number) {
        super(null, x, y, width, height);
        this.speed = speed;
        this.color = "red";
        this.isDestroyed = false;
    }

    public render(context: any, direction: string) {
        if (this.isDestroyed) {
            this.color = "gray";
            this.speed = 3;

            if (this.fallDirection == 0) {
                this.fallDirection = Util.randomBoolean() ? 1 : -1;
            }

            this.x += this.fallDirection * this.speed;
        }

        super.render(context, this.color, direction);
    }
}

export { Enemy };