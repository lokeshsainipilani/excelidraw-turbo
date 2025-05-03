
import { WebSocketServer, WebSocket } from "ws";
import {createClient} from "redis"
import jwt, { JwtPayload } from "jsonwebtoken"
import {JWT_SECRET} from "@repo/config/config"
import {PrismaClient} from "@repo/db/client"
import { TOPIC } from "./config";

const wss = new WebSocketServer({port:8080});
const publisher = createClient();
const prisma = new PrismaClient();

(async ()=>{
    await publisher.connect();
    console.log("redis connected successfullly")
})

interface User {
    ws:WebSocket,
    rooms:Number[],
    userId:string
}

const users:User[] = [];

function checkUser(token:string){
    try{
        const decode = jwt.verify(token, JWT_SECRET)

        if(!decode || !(decode as JwtPayload).userId){
            return null;
        }
        return (decode as JwtPayload).userId
    }catch(e){
        console.log(e)
    }
}

wss.on('connection', async (ws, request)=>{
    const url = request.url;
    if(!url){
        return
    }

    const urlParams = new URLSearchParams(url.split("?")[1]);
    const token = urlParams.get("token") || "";
    const userId = checkUser(token);

    if(!userId){
        ws.close();
        return null
    }

    const user:User ={userId, rooms:[], ws};
    users.push(user);

    ws.on('message', async (message)=>{
        let parsedData;
        if(typeof message !== "string"){
            parsedData = JSON.parse(message.toString());

        }else{
            parsedData = JSON.parse(message)
        }
        if(parsedData.type === "join_room"){
            const roomId = Number(parsedData.roomId);
            const user = users.find(user => user.ws === ws);
            if(user){
                user.rooms.push(roomId)
            }

            const rooms = users.flatMap(user => user.rooms)

        }
        if(parsedData.type === "leave_room"){
            const roomId = Number(parsedData.roomId);
            const user = users.find(user => user.ws === ws);

            if(user){
                user.rooms = user.rooms.filter(r => r !== roomId)
            }
            console.log("message received");
            console.log(parsedData);
        }

        if(parsedData.type ===  "chat"){
            const roomId = Number(parsedData.roomId);
            const message = parsedData.message;

            const user = users.filter(user => user.userId === userId[0])

            await publisher.xAdd(TOPIC, "*", {
                roomId: String(roomId),
                message,
                userId
            });
            users.forEach((user)=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(
                        JSON.stringify({
                            type:"chat",
                            roomId,
                            message
                        })
                    )
                }
            })

        }

        if(parsedData.type === "move_shape"){
            const roomId = Number(parsedData.roomId);
            const {shape, shapeIndex} = parsedData;
            users.forEach((user)=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(
                        JSON.stringify({
                            type:'move_shape',
                            roomId,
                            shape,
                            shapeIndex
                        })
                    )
                }
            }) 
        }

        if(parsedData.type === "delete_shape"){
            const {roomId , deleteIndex}= parsedData;

            users.forEach((user)=>{
                if(user.rooms.includes(Number(roomId))){
                    user.ws.send(
                        JSON.stringify({
                            type:"delete_shape",
                            deleteIndex,
                            roomId
                        })
                    )
                }
            })
        }

        if(parsedData === "delete_shape_by_id"){
            const {shapeId, roomId} = parsedData;
            users.forEach((user)=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(
                        JSON.stringify({
                            type:"delete_shape_by_id",
                            shapeId,
                            roomId
                        })
                    )
                }
            })
        }
    })

    ws.on("close", ()=>{
        const index = users.indexOf(user);
        if(index !== -1){
            users.slice(index, 1)
        }
    })
})