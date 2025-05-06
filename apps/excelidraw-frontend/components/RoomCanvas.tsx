"use client"
import { useEffect, useState } from "react"
import { WS_URL } from "../lib/config";
import Canvas from "./Canvas";

const RoomCanvas = ({roomId}:{roomId:string})=>{
    const [socket , setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(
          `${WS_URL}?token`
        );
        ws.onopen = ()=>{
            setSocket(ws);
            const data = JSON.stringify({
                type:"join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }

    },[roomId]);

    if(!socket){
        return <div>connecting to the server ...</div>
    }

    return (
        <div className="w-full">
            <Canvas roomId={roomId} socket={socket} />
        </div>
    )


}

export default RoomCanvas;