import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to AI Voice Outreach API",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "AI Voice Outreach backend is running",
  });
});

export default app;