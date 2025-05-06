import { useEffect, useRef, useState } from "react";
import { colorOptions, Game, lineWidths } from "./draw/Game";
import Toolbar from "./Toolbar";

export type Tool = "circle" | "rectangle" ;

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")
    const [color, setSelectedColor] = useState<colorOptions>("#000000");
    const [lineWidth, setLinewidth] = useState<lineWidths>(1)

    useEffect(() => {
        game?.setTool(selectedTool);
        game?.setSelectedColor(color);
        
        game?.setLineWidth(lineWidth);
    }, [selectedTool, game, color, lineWidth]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }


    }, [canvasRef]);

    return <div className="min-h-screen flex flex-col items-center">
    
    <div className="flex flex-col-2">
    <Toolbar color={color} setColor={setSelectedColor} lineWidth={lineWidth} setLinewidth={setLinewidth} />
    <canvas ref={canvasRef}  width={window.innerWidth} height={window.innerHeight}  />
    </div>
    
    
</div>
}
export default Canvas