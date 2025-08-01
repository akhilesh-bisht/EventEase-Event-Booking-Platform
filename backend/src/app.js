import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()


// Enable CORS with specific origin and credentials
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";

//routes declarations
app.use("/api/v1/users", userRouter);

export default app;