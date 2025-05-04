import { HTTP_URL } from "../../lib/config";

export async function getCanvasShapes(roomId:string) {
    const data = await fetch(`${HTTP_URL}/api/v1/chats/${roomId}`);
    const res = await data.json()
    const messages = res.messages;

    const shapes = messages.map(({message}:{message:string})=>{
        const messageData = JSON.parse(message);
        return messageData.shape;
    })

    return shapes;
}