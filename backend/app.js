import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import propertyRoutes from "./routes/property.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/properties", propertyRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RealEstate API is running!",
  });
});

export default app;