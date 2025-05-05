import { JWT_SECRET } from "@repo/config/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
export interface customRequest extends Request {
    userId: string
}

export function middleware(req:customRequest, res:Response, next:NextFunction){

    const token = req.headers["authorization"] ?? ""

    const decoded = jwt.verify(token, JWT_SECRET) as {userId:string}
    req.userId = decoded.userId
    next()
    
}