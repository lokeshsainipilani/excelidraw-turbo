import   { Router }  from "express";
import userRouter from "./user";
import roomRouter from "./room";
import chatRouter from "./chat";

const rootRouter = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/room", roomRouter);
rootRouter.use("/chat", chatRouter);

export default rootRouter 