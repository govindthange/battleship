class Base {
    x: number;
    y: number;
    width: number;
    height: number;

    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public render(context: any, color: any, direction: string) {
        this.drawTriangle(context, color, this.x, this.y, this.width, this.height, direction);
    }

    public drawTriangle(context: any, color: string, x: number, y: number, width: number, height: number, direction: string) {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x - width, y);
        context.lineTo(x, direction === "up" ? y - height : y + height);
        context.lineTo(x + width, y);
        context.lineTo(x - width, y);
        context.fill();
    }
}

export { Base };