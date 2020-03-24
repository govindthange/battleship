import { range } from "rxjs";
import { Particle } from "./Particle"

class ParticleProducer {
    width: number;
    height: number;
    density: number;

    constructor(width: number, height: number, density: number) {
        this.width = width;
        this.height = height;
        this.density = density;
    }

    produce() {
        let coord = {
            x: (Math.random() * this.width),
            y: (Math.random() * this.height)
        };

        let size = Math.random() * 3 + 1;

        return new Particle(coord.x, coord.y, size);
    }

    public subscribe(callback: any) {
        let observable = range(1, this.density);     
        observable.subscribe(
            (x: any) => callback(this.produce())
        )
    }
}

export { ParticleProducer as ParticleProducer };