import { Router } from "express";
import {
  createCar,
  getAllCars,
  getCarByCarPlateNo,
  deleteCar,
  updateCar,
  uploadCarImage,
} from "../controllers/carController";
import multer from "multer";

const carRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Main router "/api/cars"

carRouter.get("/", getAllCars);
carRouter.get("/:carPlateNo", getCarByCarPlateNo);

carRouter.post("/add", createCar);

carRouter.delete("/remove/:carPlateNo", deleteCar);

carRouter.patch("/update", updateCar);
carRouter.patch("/upload/:carPlateNo", upload.single("car-image"), uploadCarImage);

export default carRouter;
