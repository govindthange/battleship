import { ParticleProducer } from "./ParticleProducer";
import { Particle } from "./Particle";

class Field {
    width: number;
    height: number;
    density: number;

    context: any;

    constructor(container: Element) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.density = 100;

        let canvas = document.createElement("canvas");
        this.context = canvas.getContext("2d");
        container.appendChild(canvas);
        canvas.width = this.width;
        canvas.height = this.height;

        let producer = new ParticleProducer(this.width, this.height, this.density);
        producer.subscribe(this.renderParticle.bind(this));
    }

    renderParticle(p: any) {
        this.context.fillStyle = "#ffffff";
        this.context.fillRect(p.x, p.y, p.size, p.size);
    }
}

export { Field };