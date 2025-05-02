import   { Router }  from "express";
import { PrismaClient } from "@repo/db/client";

const chatRouter = Router();
const prisma = new PrismaClient()
chatRouter.get("/:roomId", async (req , res)=>{
    const roomId = parseInt(req.params.roomId);
    const messages = await prisma.chat.findMany({
        where:{
            roomId
        },
        orderBy:{
            id:"desc"
        },
        take:1000
    })

    res.json({messages})
})

export default chatRouter;