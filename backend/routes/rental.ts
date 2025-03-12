import { Router } from "express";
import {
  createRental,
  deleteRentalById,
  getAllRentals,
  getRentalById,
  getRentalByNRICAndCarPlate,
  getRentalsByBranchNo,
  getRentalsByCarPlate,
  getRentalsByNRIC,
  updateRentalPaymentStatus,
} from "../controllers/rentalController";

const rentalRouter = Router();

rentalRouter.post("/rent", createRental);

rentalRouter.get("/nric/:nric", getRentalsByNRIC);
rentalRouter.get("/nric/:nric/carPlateNo/:carPlateNo", getRentalByNRICAndCarPlate);
rentalRouter.get("/branchNo/:branchNo", getRentalsByBranchNo);
rentalRouter.get("/rentalId/:rentalId", getRentalById);
rentalRouter.get("/carPlateNo/:carPlateNo", getRentalsByCarPlate);
rentalRouter.get("/", getAllRentals);

rentalRouter.patch("/rental/update/:rentalId", updateRentalPaymentStatus);

rentalRouter.delete("/rental/delete/:rentalId", deleteRentalById);

export default rentalRouter;
