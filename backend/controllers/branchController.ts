import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";

export function getBranchByBranchNo(req: Request, res: Response) {
  const query = `SELECT * FROM BRANCH WHERE BranchNo = ?`;

  db.query(query, [req.params.branchNo], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No branch found!");

    res.status(200).json(data[0]);
  });
}

export function getAllBranches(req: Request, res: Response) {
  const query = "SELECT * FROM BRANCH";

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(200).json(data);
  });
}
