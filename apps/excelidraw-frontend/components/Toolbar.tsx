import { Circle, Move, MoveRight, Pencil, Square, SquareDashed, Trash2 } from "lucide-react";
import { lineWidths } from "../lib/types";
import { useSelectedTool } from "../store/store";
import { Button } from "./ui/button";
import { ColorPanel } from "./ColorPanel";


interface ToolbarProps{
    color: string,
    setColor: (color: string)=> void | undefined,
    linewidth: lineWidths,
    setLinewidth:(lineWidth: lineWidths) => void
}

const Toolbar = ({color, setColor, linewidth, setLinewidth}:ToolbarProps)=>{
    const {selectedTool, setSelectedTool} = useSelectedTool();

    return (
        <div className="fixed top-10 left-30 right-30 bg-[rgb(34,35,40)] shadow-sm p-4 flex items-center gap-2 z-10 text-white rounded-md">
            <div className="flex items-center gap-2 border-r pr-4">
                <Button className="" size={"icon"} onClick={()=>{setSelectedTool("rectangle")}}
                    variant={selectedTool === "rectangle" ?"default": "ghost"}>
                    <Square size={4}/>
                </Button>
                <Button className="" size={"icon"} onClick={()=>{setSelectedTool("circle")}}
                    variant={selectedTool === "circle" ?"default": "ghost"}>
                    <Circle size={4}/>
                </Button>
                <Button className="" size={"icon"} onClick={()=>{setSelectedTool("line")}}
                    variant={selectedTool === "line" ?"default": "ghost"}>
                    <MoveRight size={4}/>
                </Button>
                <Button className="" size={"icon"} onClick={()=>{setSelectedTool("pencil")}}
                    variant={selectedTool === "pencil" ?"default": "ghost"}>
                    <Pencil size={4}/>
                </Button>
                <Button className="" size={"icon"} onClick={()=>{setSelectedTool("move")}}
                    variant={selectedTool === "move" ?"default": "ghost"}>
                    <Move size={4}/>
                </Button>
                <Button className="" size={"icon"} onClick={()=>{setSelectedTool("select")}}
                    variant={selectedTool === "select" ?"default": "ghost"}>
                    <SquareDashed size={4}/>
                </Button>
                <Button className="" size={"icon"} onClick={()=>{setSelectedTool("delete")}}
                    variant={selectedTool === "delete" ?"default": "ghost"}>
                    <Trash2 size={4}/>
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <ColorPanel selectedColor={color} setSelectedColor={setColor} linewidth={linewidth} setLinewidth={setLinewidth} />
            </div>
        </div>
    )
}

export default Toolbar;