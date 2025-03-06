import { Router } from "express";
import { createStaff, deleteStaff, getStaffByUserId, updateStaffInfo } from "../controllers/staffController";

const staffRouter = Router();

staffRouter.post("/create", createStaff);
staffRouter.get("/:userId", getStaffByUserId);
staffRouter.patch("/update", updateStaffInfo);
staffRouter.delete("/delete/:userId", deleteStaff);

export default staffRouter;
