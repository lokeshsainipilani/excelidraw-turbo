"use client"
import { useEffect, useRef, useState } from "react"
import { Game } from "./draw/game";
import { colorOptions, lineWidths } from "../lib/types";
import { useSelectedTool } from "../store/store";
import { DownloadCanvas } from "./DownloadCanvas";
import Toolbar from "./Toolbar";
import { cn } from "../lib/utils";

const Canvas = ({roomId, socket}:{roomId:string, socket:WebSocket})=>{
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();

    const [color, setSelectedColor] = useState<colorOptions>("#000000");
    const [linewidth, setLinewidth] = useState<lineWidths>(1)
    const {selectedTool, setSelectedTool} = useSelectedTool();

    useEffect(()=>{
        game?.setSelectedColor(color);
        game?.setSelectedTool(selectedTool);
        game?.setLinewidth(linewidth);
        
    },[color, linewidth, selectedTool, game]);

    useEffect(()=>{
        const canvas = canvasRef.current;
        if(!canvas) return;

        const g = new Game(canvas, roomId, socket)
        console.log(g);

        setGame(g);

        return ()=>{
            g.destroy()
        }
    }, [roomId, socket]);
    
    return(
        <div className="min-h-screen flex flex-col items-center">
            <div className="flex flex-col-2">
                <DownloadCanvas canvasRef={canvasRef}/>
            </div>
            <div className="flex flex-col-2">
            <Toolbar color={color} setColor={setSelectedColor} linewidth={linewidth} setLinewidth={setLinewidth} />
            <canvas ref={canvasRef}  width={window.innerWidth} height={window.innerHeight}  />
            </div>
            
            
        </div>
    )

}
export default Canvas;