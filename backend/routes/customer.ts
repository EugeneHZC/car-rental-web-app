import { Router } from "express";
import { createCustomer, getCustomerByUserID, updateCustomerInfo } from "../controllers/customerController";

const customerRouter = Router();

customerRouter.post("/create", createCustomer);
customerRouter.get("/customer/:userId", getCustomerByUserID);
customerRouter.patch("/customer/update", updateCustomerInfo);

export default customerRouter;
