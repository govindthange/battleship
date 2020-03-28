class Util {
    static random(max: number): number {
        return this.randomRange(0, max);
    }

    static randomRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export { Util };