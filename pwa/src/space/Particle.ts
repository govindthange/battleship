class Particle {
    x: number;
    y: number;
    size: number;

    constructor(config: any) {
        this.x = config.x;
        this.y = config.y;
        this.size = config.size;
    }
}

export { Particle };