import   { Router, Request, Response }  from "express";
import { customRequest, middleware } from "../middleware";
import { CreateRoomSchema } from "@repo/common/types";
import { PrismaClient } from "@repo/db/client";

const roomRouter = Router();
const prisma = new PrismaClient()
roomRouter.post("/", middleware, async (req:customRequest, res:Response)=>{
    const body = req.body;
    const {success} = CreateRoomSchema.safeParse(body);

    if(!success){
        res.json({message:"incorrect inputs"})
        return;
    }
    
    const userId = req.userId
    const room = await prisma.room.create({
        data:{
            slug: body.name,
            adminId:userId
        }
    })
    res.json({roomId:room.id})
})

roomRouter.get("/:slug", async (req, res)=>{
    const slug = req.params.slug;
    const room = await prisma.room.findFirst({
        where:{
            slug
        }
    })
    if (!room) {
        res.status(404).json({
          message: "Room not found",
        });
        return;
    }

    res.json({room})
})

export default roomRouter;