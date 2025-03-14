import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";

export function createRental(req: Request, res: Response) {
  const query =
    "INSERT INTO RENTAL(RentalDate, PickUpTime, DropOffTime, TotalPrice, PaymentStatus, CarPlateNo, NRIC) VALUES (?, ?, ?, ?, ?, ?, ?)";

  const values = [
    req.body.RentalDate,
    req.body.PickUpTime,
    req.body.DropOffTime,
    req.body.TotalPrice,
    req.body.PaymentStatus,
    req.body.CarPlateNo,
    req.body.NRIC,
  ];

  db.query(query, values, (err, _) => {
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
  const query = "SELECT * FROM RENTAL WHERE NRIC = ?";

  db.query(query, [req.params.nric], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function getRentalsByBranchNo(req: Request, res: Response) {
  const query = `SELECT * FROM RENTAL WHERE CarPlateNo IN (
    SELECT CarPlateNo FROM CAR WHERE BranchNo = '${req.params.branchNo}'
  )`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function getRentalByNRICAndCarPlate(req: Request, res: Response) {
  const query = "SELECT * FROM RENTAL WHERE NRIC = ? AND CarPlateNo = ?";

  db.query(query, [req.params.nric, req.params.carPlateNo], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function getRentalsByCarPlate(req: Request, res: Response) {
  const query = "SELECT * FROM RENTAL WHERE CarPlateNo = ?";

  db.query(query, [req.params.carPlateNo], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function getRentalById(req: Request, res: Response) {
  const query = "SELECT * FROM RENTAL WHERE RentalID = ?";

  db.query(query, [req.params.rentalId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}

export function updateRentalPaymentStatus(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM RENTAL WHERE RentalID = ?";

  db.query(selectQuery, [req.params.rentalId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Rental not found!");

    const updateQuery = "UPDATE RENTAL SET PaymentStatus = ? WHERE RentalID = ?";

    db.query(updateQuery, [req.body.paymentStatus, req.params.rentalId], (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Rental updated successfully!");
    });
  });
}

export function deleteRentalById(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM RENTAL WHERE RentalID = ?";

  db.query(selectQuery, [req.params.rentalId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Rental not found!");

    const deleteQuery = "DELETE FROM RENTAL WHERE RentalID = ?";

    db.query(deleteQuery, [req.params.rentalId], (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Rental deleted successfully!");
    });
  });
}
