import { Base } from "../core/Base";
import { Util } from "../core/Util";
import { Shape } from "../objects/Shape";

class Particle extends Base {

    color: string;

    static CreateParticleWithinFrame(canvas: HTMLCanvasElement, width: number, height: number) {
        let x = Util.random(width),
            y = Util.random(height),
            size = Util.randomRange(1, 5);
        
        return new Particle(canvas, x, y, size, size);
    }
    
    constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number) {
        super(canvas, x, y, width, height);

        let colors = ["white", "#E5FAF9", "#B2FCF9", "#FAC2B2", "#C7FAB2"];
        this.color = colors[Util.randomRange(0, colors.length-1)];
    }

    public render() {
        Shape.drawCircle(this.context, this.color, this.x, this.y, this.width/2);
    }
}

export { Particle };