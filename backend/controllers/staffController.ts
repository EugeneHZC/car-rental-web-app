import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";

export async function createStaff(req: Request, res: Response) {
  // Check for staff ID already exists
  const selectStaffIdQuery = "SELECT * FROM STAFF WHERE StaffID = ?";

  db.query(selectStaffIdQuery, [req.body.StaffID], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("Staff ID already used in another account!");

    // Check for phone number already exists
    const selectPhoneNoQuery = "SELECT * FROM STAFF WHERE PhoneNumber = ?";

    db.query(selectPhoneNoQuery, [req.body.PhoneNumber], (err, data: RowDataPacket[]) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("Phone number already used in another account!");

      // create new staff in database
      const insertQuery = "INSERT INTO STAFF VALUES (?, ?, ?, ?, ?, ?)";

      const values = [
        req.body.StaffID,
        req.body.Name,
        req.body.Gender,
        req.body.PhoneNumber,
        req.body.UserID,
        req.body.BranchNo,
      ];

      db.query(insertQuery, values, (err, _) => {
        if (err) return res.status(500).json(err);

        res.status(201).json("Staff created!");
      });
    });
  });
}

export async function getStaffByUserId(req: Request, res: Response) {
  const query = "SELECT * FROM STAFF WHERE UserID = ?";

  db.query(query, [req.params.userId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data[0]);
  });
}

export async function updateStaffInfo(req: Request, res: Response) {
  const query = "SELECT * FROM STAFF WHERE UserID = ?";

  db.query(query, [req.body.UserID], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No staff found!");

    const updateQuery = "UPDATE STAFF SET Name = ?, PhoneNumber = ?, BranchNo = ? WHERE StaffID = ?";

    const values = [req.body.Name, req.body.PhoneNumber, req.body.BranchNo, req.body.StaffID];

    db.query(updateQuery, values, (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Staff updated successfully!");
    });
  });
}

export function deleteStaff(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM STAFF WHERE UserID = ?";

  db.query(selectQuery, [req.params.userId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No staff found!");

    const deleteQuery = "DELETE FROM STAFF WHERE UserID = ?";

    db.query(deleteQuery, [req.params.userId], (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Staff deleted successfully!");
    });
  });
}
