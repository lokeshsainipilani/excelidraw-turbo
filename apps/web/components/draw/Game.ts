import { getExistingShapes } from "./http";



export type Tool = "rectangle" | "circle" 

export const Colors = [
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ];

export type colorOptions = (typeof Colors)[number];

export type lineWidths = 1 | 2 | 3 | 4 | 5 | 10;

type Shape = {
    type: "rectangle";
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    lineWidth: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
    color: string;
    lineWidth: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    lineWidth: number;
}

export class Game{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    
    private startX: number;
    private startY: number;
    private selectedTool: Tool = "circle";
    private selectedColor: string;
    private lineWidth: number;
    private clicked:boolean
    
    
    socket: WebSocket;
    
    constructor(canvas:HTMLCanvasElement, roomId:string, socket:WebSocket){
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.startX = 0;
        this.startY = 0;
        this.selectedColor = "#FFFFFF";
        this.lineWidth = 1
        this.socket = socket
        this.clicked = false

    }
    setTool(tool: "circle" | "rectangle") {
        this.selectedTool = tool;
    }

    setSelectedColor(color: colorOptions){
        this.selectedColor = color;
    }

    setLineWidth(lineWidth:lineWidths){
        this.lineWidth = lineWidth
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)

        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)

        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.existingShapes.map((shape) => {
            if (shape.type === "rectangle") {
                this.ctx.strokeStyle = this.selectedColor
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                console.log(shape);
                this.ctx.strokeStyle = this.selectedColor;
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            }
        })
    }

    mouseDownHandler = (e:any) => {
        this.clicked = true
        this.startX = e.clientX
        this.startY = e.clientY
    }

    mouseUpHandler = (e:any) => {
        this.clicked = false
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        if (selectedTool === "rectangle") {

            shape = {
                type: "rectangle",
                x: this.startX,
                y: this.startY,
                height,
                width,
                color:this.selectedColor,
                lineWidth:this.lineWidth
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
                color:this.selectedColor,
                lineWidth:this.lineWidth
            }
        }

        if (!shape) {
            return;
        }

        this.existingShapes.push(shape);

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }


    mouseMoveHandler = (e:any) => {
        if (this.clicked) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle = this.selectedColor
            const selectedTool = this.selectedTool;
            console.log(selectedTool)
            if (selectedTool === "rectangle") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);   
            } else if (selectedTool === "circle") {
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)

        this.canvas.addEventListener("mouseup", this.mouseUpHandler)

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    

    }

    

    async initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket){
        const ctx = canvas.getContext("2d");

        let existingShapes: Shape[] = await getExistingShapes(roomId)

    if (!ctx) {
        return
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type == "chat") {
            const parsedShape = JSON.parse(message.message)
            existingShapes.push(parsedShape.shape)
            this.clearCanvas();
        }
    }

    this.clearCanvas();
    

    this.canvas.addEventListener("mousedown", this.mouseDownHandler)

    this.canvas.addEventListener("mouseup", this.mouseUpHandler)

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler)        
    }
}