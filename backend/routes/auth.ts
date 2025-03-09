import express from "express";
import {
  deleteUser,
  getUserByUserId,
  login,
  register,
  updateUserInfo,
  updateUserPassword,
} from "../controllers/authController";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.patch("/update/info/:userId", updateUserInfo);
userRouter.patch("/update/password/:userId", updateUserPassword);
userRouter.delete("/delete/:userId", deleteUser);
userRouter.get("/user/:userId", getUserByUserId);

export default userRouter;
