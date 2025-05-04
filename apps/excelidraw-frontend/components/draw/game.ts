import { Mouse } from "lucide-react";
import { lineWidths, Shape, Tool } from "../../lib/types";
import { getCanvasShapes } from "./http";
import { nanoid } from "nanoid";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private isDrawing: boolean;
    private startX: number;
    private startY: number;
    private selectedTool: Tool;
    private selectedColor: string;
    private linewidth: number;
    private currentPath: {x:number, y: number}[]
    private zoomScale: number;
    socket: WebSocket;
    private selectedShapeIndex: number | null;
    private isDraging: boolean
    private deleteShapeIndex: number | null
    private shapesToBeDeleted: Shape[];
    private selectionRectangle:{startX:number; startY:number; endX:number; endY:number} | null

    constructor(canvas:HTMLCanvasElement, roomId:string, socket:WebSocket){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.isDrawing = false;
        this.isDraging = false;
        this.startX = 0;
        this.startY = 0;
        this.selectedTool = "rectangle";
        this.selectedColor = '#FFFFFF';
        this.linewidth = 1;
        this.currentPath = [];
        this.socket = socket;
        this.zoomScale = 1;
        this.deleteShapeIndex = null;
        this.selectionRectangle =null;
        this.shapesToBeDeleted = [];
        this.selectedShapeIndex = null;

        this.startDrawing = this.startDrawing.bind(this);
        this.Drawing = this.isDrawing.bind(this);
        this.stopDrawing = this.stopDrawing.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);


        this.initCanvas();
    }

    private initCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.scale(this.zoomScale, this.zoomScale);
    }

    private async initExistingShapes(){
        this.existingShapes = await getCanvasShapes(this.roomId);
        console.log(this.existingShapes);

        this.clearCanvas();
    }

    private initZoomHandlers(){
        window.addEventListener("keydown", (event)=>{
            if(event.ctrlKey){
                if(event.key === "=" || event.key ==="+"){
                    this.zoomScale += 0.01;
                    this.applyZoom()
                    event.preventDefault();
                }else if(event.key === "-"){
                    this.zoomScale = Math.max(0.5, this.zoomScale - 0.01);
                    this.applyZoom()
                    event.preventDefault()
                }
            }
        })
    }

    private applyZoom(){
        this.ctx.setTransform(this.zoomScale, 0, 0, this.zoomScale, 0, 0);
        this.clearCanvas();
    }

    setSelectedTool(tool:Tool){
        this.selectedTool = tool;
        console.log(this.selectedTool)
    }

    setSelectedColor(color:string){
        this.selectedColor = color;
        console.log(this.selectedColor)
    }

    setLinewidth(linewidth:number){
        this.linewidth = linewidth;
        console.log(this.linewidth)
    }

    handleDoubleClick(e:MouseEvent){
        const x = e.offsetX + this.canvas.offsetLeft;
        const y = e.offsetY + this.canvas.offsetTop;

        this.clearCanvas()

        const clickedShape = this.existingShapes.find((shape)=>{
            if(shape.type === "text"){
                const {startX, startY, endX, endY} = this.getBoundingBox(shape)!;
                console.log(startX, startY, endX, endY);

                return (x >= startX && x<= endX) || (y>=startY && y <= endY)
            }

            return false;
        });

        if(clickedShape){
            console.log("clickedShape ->", clickedShape)

            this.socket.send(
                JSON.stringify({
                    type:"delete_shape_bu_id",
                    shapeId:clickedShape.id,
                    roomId:this.roomId
                })
            )
        }

        const input = document.createElement("input");
        input.type = "text";
        input.value = (clickedShape ? clickedShape.value : "") as string;
        input.style.position = "absolute";
        input.style.left = `${clickedShape? clickedShape.startX : x}px`;
        input.style.top = `${clickedShape ? clickedShape.startY: y-10}px`;
        input.style.font = "20px arial";
        input.style.background = "transparent";
        input.style.color = `${clickedShape ? clickedShape.color : this.selectedColor}`;
        input.style.border = "none";
        input.style.outline = "none";
        input.style.zIndex = "1000";

        document.body.appendChild(input);
        input.focus();

        let isRemoved = false;

        const removeInput = ()=>{
            if(!isRemoved && document.body.contains(input)){
                isRemoved =true;
                document.removeChild(input)
            }
        }
        input.addEventListener("keydown", (event)=>{
            if(event.key === "Enter"){
                const text = input.value;
                if(text){
                    this.renderText(
                        text,
                        clickedShape ? clickedShape.startX :x,
                        clickedShape ? clickedShape.startY : y+10
                    )
                }
                removeInput()
            }
        });
        input.addEventListener("blur", ()=>{
            if(input.value){
                this.renderText(
                    input.value,
                    clickedShape ? clickedShape.startX : x,
                    clickedShape ? clickedShape.startY : y + 10
                );
            }
            removeInput()
        })
    }

    renderText(text:string, x:number, y:number){
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = this.selectedColor;
        this.ctx.fillText(text, x, y);

        const existingTextShapes = this.existingShapes.find(
            (shape)=>{
                shape.type === "text" && shape.startX === x && shape.startY === y

            }
            
        )
        if(existingTextShapes){
            return
        }

        const shape:Shape = {
            id:nanoid(),
            type:"text",
            startX:x,
            startY: y,
            color: this.selectedColor,
            endX:0,
            endY:0,
            linewidth:this.linewidth,
            value:text
        }
        this.existingShapes.push(shape);

        this.socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify({shape}),
            roomId:this.roomId
        }))
    }

    isShapeClicked(shape:Shape, mouseX:number, mouseY:number){
        switch(shape.type){
            case "rectangle":
                return (
                    mouseX >= shape.startX && 
                    mouseX >= shape.endX &&
                    mouseY >= shape.startY &&
                    mouseY >= shape.endY
                );
                case "circle": 
                const radius = Math.sqrt(
                    Math.pow(shape.endX - shape.startX ,2 ) + Math.pow(shape.endY - shape.startY, 2)
                );

                const distance = Math.sqrt(
                    Math.pow(mouseX - shape.startX, 2) + Math.pow(mouseY - shape.startY, 2)
                );
                return distance <= radius;

                case "line": 
                const distanceToLine = this.distanceToLine(
                    shape.startX,
                    shape.startY,
                    shape.endX,
                    shape.endY,
                    mouseX,
                    mouseY
                )
                return distanceToLine <= shape.linewidth

                case "text":
                    const textWidth = this.ctx.measureText(shape.value!).width;
                    const textHeight = 20;
                    return (
                        mouseX >= shape.startX &&
                        mouseX <= shape.startX + textWidth &&
                        mouseY >= shape.startY - textHeight&&
                        mouseY <= shape.startY

                    );
                default:
                    return false;
        }
    }

    distanceToLine(x1:number,y1:number, x2:number, y2:number, px:number, py:number){
        const numerator = Math.abs((y2-y1)*px - (x2-x1)*py + x2*y1 - x1*y2)
        
        const denominator = Math.sqrt(Math.pow(y2-y1 , 2) + Math.pow(x2-x1, 2))

        return numerator/denominator
    }

    // startDrawing(e:MouseEvent){
    //     const {offsetX, offsetY} = e;

    //     if(this.selectedTool === "delete"){
    //         for(let i = this.existingShapes.length -1; i>=0; i--){

    //         }
    //     }
    // }
}