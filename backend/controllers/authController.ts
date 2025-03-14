import { Request, Response } from "express";
import { db } from "../connect";
import { RowDataPacket } from "mysql2";
import bcrypt, { genSaltSync, hashSync } from "bcryptjs";

export function register(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM USER WHERE email = ?";

  db.query(selectQuery, [req.body.email], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    // if the email used existed in database, return an error
    if (data.length) return res.status(403).json("Email already in use!");

    // generate a hash password for security
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS ?? "0"));
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // insert a new user into database
    const insertQuery = "INSERT INTO USER(Name, Email, Password, Role) VALUES (?, ?, ?, ?)";

    const values = [req.body.name, req.body.email, hashedPassword, req.body.role];

    db.query(insertQuery, values, (err, _) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json("User created successfully!");
    });
  });
}

export function login(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM USER WHERE Email = ?";

  db.query(selectQuery, [req.body.email], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length == 0) return res.status(404).json("Incorrect email!");

    // check if the hashed password given is the same as in the database
    const checkPassword = bcrypt.compareSync(req.body.password, data[0].Password);

    if (!checkPassword) return res.status(401).json("Incorrect password!");

    if (req.body.name !== data[0].Name) return res.status(401).json("Incorrect name.");

    // get the other data except the password from the database
    const { password, ...others } = data[0];

    res.status(200).json({ others });
  });
}

export function updateUserInfo(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM USER WHERE UserID = ?";

  db.query(selectQuery, [req.params.userId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No user found!");

    const updateQuery = "UPDATE USER SET Name = ?, Email = ? WHERE UserID = ?";

    db.query(updateQuery, [req.body.name, req.body.email, req.params.userId], (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("User info updated successfully!");
    });
  });
}

export function updateUserPassword(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM USER WHERE UserID = ?";

  db.query(selectQuery, [req.params.userId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No user found!");

    const checkPassword = bcrypt.compareSync(req.body.oldPassword, data[0].Password);
    if (!checkPassword) return res.status(401).json("Old password is incorrect!");

    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS ?? "0"));
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, salt);

    const updateQuery = "UPDATE USER SET Password = ? WHERE UserID = ?";

    db.query(updateQuery, [hashedPassword, req.params.userId], (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("User password updated successfully!");
    });
  });
}

export function updateUserForgottenPassword(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM USER WHERE Email = ?";

  db.query(selectQuery, [req.body.email], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No user found!");

    const salt = genSaltSync(parseInt(process.env.SALT_ROUNDS ?? "0"));
    const hashedPassword = hashSync(req.body.newPassword, salt);

    const updateQuery = "UPDATE USER SET Password = ? WHERE Email = ?";

    db.query(updateQuery, [hashedPassword, req.body.email], (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("Password updated!");
    });
  });
}

export function deleteUser(req: Request, res: Response) {
  const selectQuery = "SELECT * FROM USER WHERE UserID = ?";

  db.query(selectQuery, [req.params.userId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No user found!");

    const deleteQuery = "DELETE FROM USER WHERE UserID = ?";

    db.query(deleteQuery, [req.params.userId], (err, _) => {
      if (err) return res.status(500).json(err);

      res.status(200).json("User deleted successfully!");
    });
  });
}

export function getUserByUserId(req: Request, res: Response) {
  const query = "SELECT * FROM USER WHERE UserID = ?";

  db.query(query, [req.params.userId], (err, data: RowDataPacket[]) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("No user found!");

    res.status(200).json(data[0]);
  });
}
