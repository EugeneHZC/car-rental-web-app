import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";

export function createCustomer(req: Request, res: Response) {
  const query = `INSERT INTO CUSTOMER VALUES (
    '${req.body.nric}',
    '${req.body.name}',
    '${req.body.gender}',
    '${req.body.phoneNumber}',
    ${req.body.licenseNumber},
    '${req.body.address}',
    ${req.body.userId}
    )`;

  db.query(query, (err, _) => {
    if (err) return res.status(500).json(err);

    res.status(201).json("Customer created successfully!");
  });
}

export function getCustomerByUserID(req: Request, res: Response) {
  const query = `SELECT * FROM CUSTOMER WHERE UserID = '${req.params.userId}'`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data[0]);
  });
}

export function updateCustomerInfo(req: Request, res: Response) {
  const selectQuery = `SELECT * FROM CUSTOMER WHERE UserID = ${req.body.UserID}`;

  db.query(selectQuery, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Customer not found!");

    const updateQuery = `UPDATE CUSTOMER SET 
    Name = '${req.body.Name}',
    PhoneNumber = '${req.body.PhoneNumber}',
    Address = '${req.body.Address}'
    WHERE NRIC = '${req.body.NRIC}'
    `;

    db.query(updateQuery, (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Customer updated successfully!");
    });
  });
}
