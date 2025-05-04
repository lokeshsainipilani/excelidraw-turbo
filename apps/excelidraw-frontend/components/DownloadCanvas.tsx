"use client"

import React from "react"
import { Button } from "./ui/button"

const DownloadCanvas = ({canvasRef}:{canvasRef:React.RefObject<HTMLCanvasElement | null> })=>{
    const downloadCanvas = ()=>{
        const canvas = canvasRef.current;
        if(!canvas) return;

        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "drawing.png"
        link.href = url;
        link.click();
    }

    return <div className="fixed top-8 right-10 z-10 p-4">
        <Button variant={"secondary"} size={"lg"} onClick={downloadCanvas} >
            Download
        </Button>
    </div>
}
