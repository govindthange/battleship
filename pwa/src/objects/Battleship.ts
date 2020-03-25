class Battleship {

    point: {
        x: number,
        y: number
    }
    
    width: number;
    
    constructor(canvas: HTMLCanvasElement) {
        this.point = {
            x: canvas.width / 2,
            y: canvas.height - 20
        }
        this.width = 20;
    }

    render(context: any, point: any, direction: string) {

        if (point) {
            this.point.x = point.x;
        }

        context.fillStyle = "red";
        context.beginPath();
        context.moveTo(this.point.x - this.width, this.point.y);
        context.lineTo(this.point.x, direction === "up" ? this.point.y - this.width : this.point.y + this.width);
        context.lineTo(this.point.x + this.width, this.point.y);
        context.lineTo(this.point.x - this.width, this.point.y);
        context.fill();
    }
}

export { Battleship };