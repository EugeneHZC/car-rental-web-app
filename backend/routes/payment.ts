import { Router } from "express";
import { createPayment, getPaymentByRentalId, updatePayment } from "../controllers/paymentController";

const paymentRouter = Router();

paymentRouter.post("/create", createPayment);
paymentRouter.get("/payment/:rentalId", getPaymentByRentalId);
paymentRouter.patch("/payment/update/:paymentId", updatePayment);

export default paymentRouter;
