import { Router } from "express";
import {
  createCustomer,
  getCustomerByNRIC,
  getCustomerByUserID,
  updateCustomerInfo,
  deleteCustomer,
} from "../controllers/customerController";

const customerRouter = Router();

customerRouter.post("/create", createCustomer);
customerRouter.get("/customer/:userId", getCustomerByUserID);
customerRouter.get("/customer/nric/:nric", getCustomerByNRIC);
customerRouter.patch("/customer/update", updateCustomerInfo);
customerRouter.delete("/customer/delete/:userId", deleteCustomer);

export default customerRouter;
