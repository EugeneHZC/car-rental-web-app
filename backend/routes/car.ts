import { Router } from "express";
import { createCar, getAllCars, getCarByCarPlateNo, deleteCar, updateCar } from "../controllers/carController";

const carRouter = Router();

carRouter.get("/", getAllCars);
carRouter.get("/:carPlateNo", getCarByCarPlateNo);
carRouter.post("/add", createCar);
carRouter.delete("/remove/:carPlateNo", deleteCar);
carRouter.patch("/update", updateCar);

export default carRouter;
