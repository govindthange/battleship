import { ParticleProducer } from "./ParticleProducer";

class Field {
    width: number;
    height: number;
    density: number;

    constructor(container: Element) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.density = 10;

        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        container.appendChild(canvas);
        canvas.width = this.width;
        canvas.height = this.height;

        let pg = new ParticleProducer(this.width, this.height, this.density);
    }
}

export { Field };