import { range } from "rxjs";
import { Particle } from "./Particle"

class ParticleProducer {
    width: number;
    height: number;

    constructor(width: number, height: number, density: number) {
        this.width = width;
        this.height = height;

        let observable = range(1, density);        
        observable.subscribe(
            (x: any) => console.log(this.produce())
        )
    }

    produce() {
        let coord = {
            x: (Math.random() * this.width),
            y: (Math.random() * this.height)
        };

        let size = Math.random() * 3;

        return new Particle(coord.x, coord.y, size);
    }
}

export { ParticleProducer as ParticleProducer };