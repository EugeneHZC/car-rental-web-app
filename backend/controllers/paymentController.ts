import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";

export function createPayment(req: Request, res: Response) {
  const paymentDate = req.body.paymentDate ? `'${req.body.paymentDate}'` : "NULL";

  const query = `INSERT INTO PAYMENT (PaymentDate, PaymentMethod, AmountPaid, RentalID) VALUES (
    ${paymentDate},
    '${req.body.paymentMethod}',
    ${req.body.amountPaid},
    ${req.body.rentalId}
    )`;

  db.query(query, (err, _) => {
    if (err) return res.status(500).json(err);

    res.status(201).json("Payment created successfully!");
  });
}

export function getPaymentByRentalId(req: Request, res: Response) {
  const query = `SELECT * FROM PAYMENT WHERE RentalID = ${req.params.rentalId}`;

  db.query(query, (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(201).json(data[0]);
  });
}

export function updatePayment(req: Request, res: Response) {
  const query = `UPDATE PAYMENT SET PaymentDate = '${req.body.paymentDate}', 
  PaymentMethod = '${req.body.paymentMethod}', 
  AmountPaid = ${req.body.amountPaid}
  WHERE PaymentId = ${req.params.paymentId}`;

  db.query(query, (err, _) => {
    if (err) return res.status(500).json(err);

    res.status(200).json("Payment updated successful!");
  });
}
