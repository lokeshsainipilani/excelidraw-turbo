import { Circle, Move, MoveRight, Pencil, Square, SquareDashed, Trash2 } from "lucide-react";
import { lineWidths } from "../components/draw/Game";

import { Button } from "./button";
import { ColorPanel } from "./ColorPanel";
import { useState } from "react";


interface ToolbarProps{
    color: string,
    setColor: (color: string)=> void | undefined,
    linewidth: lineWidths,
    setLinewidth:(lineWidth: lineWidths) => void
}
 export type Tool = "circle" | "rectangle";

const Toolbar = ({color, setColor, linewidth, setLinewidth}:ToolbarProps)=>{
    const [selectedTool, setSelectedTool] = useState<Tool>();

    return (
        <div className="fixed top-10 left-120 right-120 bg-[rgb(34,35,40)] shadow-sm p-4 flex items-center gap-2 z-10 text-white rounded-md">
            <div className="flex items-center gap-2 border-r pr-4">
                <Button className="" size={"icon"} onClick={()=>{()=>{setSelectedTool("rectangle")}}}
                    variant={selectedTool === "rectangle" ?"default": "ghost"}>
                    <Square size={4}/>
                </Button>
                <Button className="" size={"icon"} onClick={()=>{setSelectedTool("circle")}}
                    variant={selectedTool === "circle" ?"default": "ghost"}>
                    <Circle size={4}/>
                </Button>
               
            </div>
            <div className="flex items-center gap-2">
                <ColorPanel selectedColor={color} setSelectedColor={setColor} linewidth={linewidth} setLinewidth={setLinewidth} />
            </div>
        </div>
    )
}

export default Toolbar;