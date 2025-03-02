import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";

export async function createStaff(req: Request, res: Response) {
  const selectQuery = `SELECT * FROM STAFF WHERE StaffID = '${req.body.StaffID}'`;

  db.query(selectQuery, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(401).json("Staff ID already exists!");

    const insertQuery = `INSERT INTO STAFF VALUES (
    '${req.body.StaffID}',
    '${req.body.Name}',
    '${req.body.Gender}',
    '${req.body.PhoneNumber}',
    ${req.body.UserID},
    '${req.body.BranchNo}'
    )`;

    db.query(insertQuery, (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(201).json("Staff created!");
    });
  });
}

export async function getStaffByUserId(req: Request, res: Response) {
  const query = `SELECT * FROM STAFF WHERE UserID = ${req.params.userId}`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data[0]);
  });
}

export async function updateStaffInfo(req: Request, res: Response) {
  const query = `SELECT * FROM STAFF WHERE UserID = ${req.body.UserID}`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No staff found!");

    const updateQuery = `UPDATE STAFF SET 
    Name = '${req.body.Name}',
    PhoneNumber = '${req.body.PhoneNumber}',
    BranchNo = '${req.body.BranchNo}'
    WHERE StaffID = '${req.body.StaffID}'
    `;

    db.query(updateQuery, (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Staff updated successfully!");
    });
  });
}
