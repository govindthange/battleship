import { Base } from "../core/Base";

class Enemy extends Base {

    speed: number;
    
    constructor(x: number, y: number, width: number, height: number, speed: number) {
        super(null, x, y, width, height);
        this.speed = speed;
    }

    public render(context: any, direction: string) {
        super.render(context, "red", direction);
    }
}

export { Enemy };