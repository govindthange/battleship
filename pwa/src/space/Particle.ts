import { Base } from "../core/Base";
import { Util } from "../core/Util";

class Particle extends Base {

    color: string;
    
    constructor(x: number, y: number, width: number, height: number) {
        super(null, x, y, width, height);

        let colors = ["white", "#E5FAF9", "#B2FCF9", "#FAC2B2", "#C7FAB2"];
        this.color = colors[Util.randomRange(0, colors.length-1)];
    }

    public render(context: any) {
        super.drawCircle(context, this.color, this.x, this.y, this.width / 2);
    }
}

export { Particle };