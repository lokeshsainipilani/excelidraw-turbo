import {z} from "zod";

export const CreateUserSchema = z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string()
})

export const SigninSchema = z.object({
    email: z.string(),
    password: z.string()
})

export const  CreateRoomSchema = z.object({
    name: z.string()
})