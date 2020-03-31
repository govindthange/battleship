class Shape {

    static drawCircle(context: any, color: string, x: number, y: number, radius: number) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius / 2, 0, 2 * Math.PI, false);
        context.fill();
    }

    static drawTriangle(context: any, color: string, x: number, y: number, width: number, height: number, direction: string) {
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x - width, y);
        context.lineTo(x, direction === "up" ? y - height : y + height);
        context.lineTo(x + width, y);
        context.lineTo(x - width, y);
        context.fill();
    }

    static drawAircraft(context: any, color1: string, color2: string, x: number, y: number, width: number, height: number, direction: string) {
        this.drawTriangle(context, color1, x, y + 1, width + 3, height, direction);
        this.drawTriangle(context, color2, x, y + 5, width + 2, height + 3, direction);
    }
}

export { Shape };