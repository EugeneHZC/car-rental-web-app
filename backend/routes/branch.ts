import { Router } from "express";
import { getAllBranches, getBranchByBranchNo } from "../controllers/branchController";

const branchRouter = Router();

branchRouter.get("/branch/:branchNo", getBranchByBranchNo);
branchRouter.get("/", getAllBranches);

export default branchRouter;
