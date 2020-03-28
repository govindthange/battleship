import { Base } from "../core/Base";

class Particle extends Base {
    
    constructor(x: number, y: number, width: number, height: number) {
        super(null, x, y, width, height);
    }

    public render(context: any) {
        super.drawCircle(context, "white", this.x, this.y, this.width / 2);
    }
}

export { Particle };