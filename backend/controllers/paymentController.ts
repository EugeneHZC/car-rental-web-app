import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";

export function createPayment(req: Request, res: Response) {
  const query = "INSERT INTO PAYMENT (PaymentDate, PaymentMethod, AmountPaid, RentalID) VALUES (?, ?, ?, ?)";

  const values = [req.body.paymentDate, req.body.paymentMethod, req.body.amountPaid, req.body.rentalId];

  db.query(query, values, (err, _) => {
    if (err) return res.status(500).json(err);

    res.status(201).json("Payment created successfully!");
  });
}

export function getPaymentByRentalId(req: Request, res: Response) {
  const query = "SELECT * FROM PAYMENT WHERE RentalID = ?";

  db.query(query, [req.params.rentalId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);

    res.status(201).json(data[0]);
  });
}

export function updatePayment(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM PAYMENT WHERE PaymentID = ?";

  db.query(selectQuery, [req.params.paymentId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Payment not found.");

    const updateQuery = "UPDATE PAYMENT SET PaymentDate = ?, PaymentMethod = ?, AmountPaid = ? WHERE PaymentID = ?";

    const values = [req.body.paymentDate, req.body.paymentMethod, req.body.amountPaid, req.params.paymentId];

    db.query(updateQuery, values, (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Payment updated successful!");
    });
  });
}
