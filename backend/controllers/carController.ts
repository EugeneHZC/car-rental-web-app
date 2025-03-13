import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";
import fs from "fs";

export function getAllCars(req: Request, res: Response) {
  const query = "SELECT * FROM CAR";

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    const cars = data.map((car) => {
      // convert all image to base64 because frontend requires base64 to display image
      return { ...car, Image: car.Image ? car.Image.toString("base64") : "" };
    });

    res.status(200).json(cars);
  });
}

export function getCarByCarPlateNo(req: Request, res: Response) {
  const query = `SELECT * FROM CAR WHERE CarPlateNo = '${req.params.carPlateNo}'`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No cars found!");

    res.status(200).json(data[0]);
  });
}

export function createCar(req: Request, res: Response) {
  const selectQuery = `SELECT * FROM CAR WHERE CarPlateNo = '${req.body.CarPlateNo}'`;

  db.query(selectQuery, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("Car already exists!");

    const insertQuery = `INSERT INTO CAR VALUES (
      '${req.body.CarPlateNo}',
      '${req.body.Model}',
      '${req.body.Colour}',
      '${req.body.Status}',
      ${req.body.PricePerDay},
      '${req.body.BranchNo}',
      ''
    )`;

    db.query(insertQuery, (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(201).json("Car inserted successfully!");
    });
  });
}

export function uploadCarImage(req: Request, res: Response) {
  const selectQuery = `SELECT * FROM CAR WHERE CarPlateNo = '${req.params.carPlateNo}'`;

  db.query(selectQuery, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Car not found!");

    const imageBuffer = req.file?.buffer;

    const updateQuery = "UPDATE CAR SET Image = ? WHERE CarPlateNo = ?";

    // have to use an parameterized query to insert data instead of string interpolation as image buffer cannot be treated as string
    db.query(updateQuery, [imageBuffer, req.params.carPlateNo], (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(201).json("Car image uploaded successfully!");
    });
  });
}

export function deleteCar(req: Request, res: Response) {
  const selectQuery = `SELECT * FROM CAR WHERE CarPlateNo = '${req.params.carPlateNo}'`;

  db.query(selectQuery, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Car not found!");

    const deleteQuery = `DELETE FROM CAR WHERE CarPlateNo = '${req.params.carPlateNo}'`;

    db.query(deleteQuery, (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Car deleted successfully!");
    });
  });
}

export async function updateCar(req: Request, res: Response) {
  const selectQuery = `SELECT * FROM CAR WHERE CarPlateNo = '${req.body.CarPlateNo}'`;

  db.query(selectQuery, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Car not found!");

    const updateQuery = `UPDATE CAR SET 
      Colour = '${req.body.Colour}',
      Status = '${req.body.Status}',
      PricePerDay = ${req.body.PricePerDay},
      BranchNo = '${req.body.BranchNo}'
      WHERE CarPlateNo = '${req.body.CarPlateNo}'`;

    db.query(updateQuery, (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Car updated successfully!");
    });
  });
}
