import { Router } from "express";
import { createStaff, getStaffByUserId, updateStaffInfo } from "../controllers/staffController";

const staffRouter = Router();

staffRouter.post("/create", createStaff);
staffRouter.get("/:userId", getStaffByUserId);
staffRouter.patch("/update", updateStaffInfo);

export default staffRouter;
