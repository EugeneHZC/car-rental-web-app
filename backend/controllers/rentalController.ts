import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";

export function createRental(req: Request, res: Response) {
  const query = `INSERT INTO RENTAL(PickUpTime, DropOffTime, TotalPrice, PaymentStatus, CarPlateNo, NRIC) VALUES (
    '${req.body.pickUpTime}',
    '${req.body.dropOffTime}',
    ${req.body.totalPrice},
    '${req.body.paymentStatus}',
    '${req.body.carPlateNo}',
    '${req.body.nric}'
    )`;

  db.query(query, (err, _) => {
    if (err) return res.status(500).json(err);

    res.status(201).json("Rental created successfully!");
  });
}

export function getAllRentals(req: Request, res: Response) {
  const query = "SELECT * FROM RENTAL";

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function getRentalsByNRIC(req: Request, res: Response) {
  const query = `SELECT * FROM RENTAL WHERE NRIC = '${req.params.nric}'`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function getRentalByNRICAndCarPlate(req: Request, res: Response) {
  const query = `SELECT * FROM RENTAL WHERE NRIC = '${req.params.nric}' AND CarPlateNo = '${req.params.carPlateNo}'`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function getRentalsByCarPlate(req: Request, res: Response) {
  const query = `SELECT * FROM RENTAL WHERE CarPlateNo = '${req.params.carPlateNo}'`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function getRentalById(req: Request, res: Response) {
  const query = `SELECT * FROM RENTAL WHERE RentalID = ${req.params.rentalId}`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function updateRentalPaymentStatus(req: Request, res: Response) {
  const query = `UPDATE RENTAL SET PaymentStatus = '${req.body.paymentStatus}'
  WHERE RentalID = ${req.params.rentalId}`;

  db.query(query, (err, _) => {
    if (err) return res.status(500).json(err);

    res.status(200).json("Rental updated successfully!");
  });
}
