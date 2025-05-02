import   { Router }  from "express";
import {CreateUserSchema} from "@repo/common/types"
import {PrismaClient} from "@repo/db/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/config/config";


const userRouter = Router();
const prisma = new PrismaClient()

userRouter.post("/signup", async (req, res)=>{
    const body = req.body;
    const {success} = CreateUserSchema.safeParse(body);

    if(!success){
        res.status(400).json({message:"validation error"})
        return;
    }

    try{
        const existingUser = await prisma.user.findFirst({
            where:{
                email:body.email
            }
        })

        if(existingUser){
            res.json({message:"user already exits"})
            return;
        }

        const hashedPassword = bcrypt.hash(body.password,10);

        const user = await prisma.user.create({
            data:{
                name:body.name,
                password:hashedPassword,
                email:body.email
            }
        })

        res.json({userId:user.id})
    }catch(error){
        console.log(error)
        res.json({message:"internal server error"})
    }
})

userRouter.post("/signin", async(req, res)=>{
    const body = req.body;
    const {success} = CreateUserSchema.safeParse(body);

    if(!success){
        res.status(400).json({message:"validation error"})
        return;
    }

    const user = await prisma.user.findFirst({
        where:{
            email:body.email
        }
    })
    if(!user){
        res.json({message:"user doesn't exist"})
        return;
    }

    const token = jwt.sign({userId:user.id}, JWT_SECRET);

    res.json({token})
})

export default userRouter; 