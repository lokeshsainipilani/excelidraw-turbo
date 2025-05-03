
export type Tool = "rectangle" | "circle" | "line" | "draw" | "text" | "eraser" | "pencil" | "move" | "delete" | "select";

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

export type Shape = {
    id:string,
    type: Tool,
    points: {x:number, y:number}[],
    startX:number,
    startY:number,
    endX:number,
    endY:number,
    color:string
} 