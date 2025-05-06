import   { Router }  from "express";
import {CreateUserSchema, SigninSchema} from "@repo/common/types"
//import {PrismaClient} from "@repo/db/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/config/config";
import { PrismaClient } from "@repo/db/client";


const userRouter = Router();
const prisma = new PrismaClient()

userRouter.post("/signup", async (req, res)=>{
    console.log(1)
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(12)
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    console.log(13)
    try {
        console.log(14)
        const user = await prisma.user.create({
            
            data: {
                email: parsedData.data.email,
                
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })
        console.log(15)
        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

userRouter.post("/signin", async(req, res)=>{
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    // TODO: Compare the hashed pws here
    const user = await prisma.user.findFirst({
        where: {
            email: parsedData.data.email,
            password: parsedData.data.password
        }
    })

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})

export default userRouter; 