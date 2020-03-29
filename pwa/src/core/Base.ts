class Base {
    x: number;
    y: number;
    width: number;
    height: number;

    canvas: HTMLCanvasElement;
    context: any;

    constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public render(color: any, direction: string) {
        this.drawTriangle(color, this.x, this.y, this.width, this.height, direction);
    }

    public drawCircle(color: string, x: number, y: number, radius: number) {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.arc(x, y, radius / 2, 0, 2 * Math.PI, false);
        this.context.fill();
    }

    public drawTriangle(color: string, x: number, y: number, width: number, height: number, direction: string) {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.moveTo(x - width, y);
        this.context.lineTo(x, direction === "up" ? y - height : y + height);
        this.context.lineTo(x + width, y);
        this.context.lineTo(x - width, y);
        this.context.fill();
    }
}

export { Base };