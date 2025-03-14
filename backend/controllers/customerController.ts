import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";

export function createCustomer(req: Request, res: Response) {
  const query = "INSERT INTO CUSTOMER VALUES (?, ?, ?, ?, ?, ?, ?)";

  const values = [
    req.body.NRIC,
    req.body.Name,
    req.body.Gender,
    req.body.PhoneNumber,
    req.body.LicenseNumber,
    req.body.Address,
    req.body.UserID,
  ];

  db.query(query, values, (err, _) => {
    if (err) return res.status(500).json(err);

    res.status(201).json("Customer created successfully!");
  });
}

export function getCustomerByUserID(req: Request, res: Response) {
  const query = "SELECT * FROM CUSTOMER WHERE UserID = ?";

  db.query(query, [req.params.userId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data[0]);
  });
}

export function getCustomerByNRIC(req: Request, res: Response) {
  const query = "SELECT * FROM CUSTOMER WHERE NRIC = ?";

  db.query(query, [req.params.nric], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No customer found!");

    res.status(200).json(data[0]);
  });
}

export function updateCustomerInfo(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM CUSTOMER WHERE UserID = ?";

  db.query(selectQuery, [req.body.UserID], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Customer not found!");

    const updateQuery = "UPDATE CUSTOMER SET Name = ?, PhoneNumber = ?, Address = ? WHERE NRIC = ?";

    const values = [req.body.Name, req.body.PhoneNumber, req.body.Address, req.body.NRIC];

    db.query(updateQuery, values, (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Customer updated successfully!");
    });
  });
}

export function deleteCustomer(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM CUSTOMER WHERE UserID = ?";

  db.query(selectQuery, [req.params.userId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No customer found!");

    const deleteQuery = "DELETE FROM CUSTOMER WHERE UserID = ?";

    db.query(deleteQuery, [req.params.userId], (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Customer deleted successfully!");
    });
  });
}
