import express from "express";
import cors from "cors";
import userRouter from "./routes/auth";
import carRouter from "./routes/car";
import branchRouter from "./routes/branch";
import rentalRouter from "./routes/rental";
import customerRouter from "./routes/customer";
import paymentRouter from "./routes/payment";
import staffRouter from "./routes/staff";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  cors({
    credentials: true,
  })
);

app.use("/api/auth", userRouter);
app.use("/api/cars", carRouter);
app.use("/api/branches", branchRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/customers", customerRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/staff", staffRouter);

app.listen(8080, () => {
  console.log("Listening on port 8080...");
});
