import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser, updateUserProfile } from "../controllers/user.controller.js"


let userRouter = express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)
userRouter.put("/update",isAuth,updateUserProfile)

export default userRouter

