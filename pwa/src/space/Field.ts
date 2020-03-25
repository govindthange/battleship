import { ParticleProducer } from "./ParticleProducer";
import { Particle } from "./Particle";

class Field {
    width: number;
    height: number;
    density: number;

    context: any;

    constructor(container: Element) {
        this.width = window.innerWidth - 20;
        this.height = window.innerHeight;
        this.density = 140;

        let canvas = document.createElement("canvas");
        this.context = canvas.getContext("2d");
        container.appendChild(canvas);
        canvas.width = this.width;
        canvas.height = this.height;

        let producer = new ParticleProducer(this.width, this.height, this.density);
        producer.subscribe(this.renderParticles.bind(this));
    }

    renderParticles(particles: Array<Particle>) {
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.fillStyle = "#ffffff";

        particles.forEach(
            (p: Particle) => this.context.fillRect(p.x, p.y, p.size, p.size)
        );
    }
}

export { Field };