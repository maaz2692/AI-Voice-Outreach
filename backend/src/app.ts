import express, { Request, Response } from "express";
import cors from "cors";
import contactRoutes from "./routes/contact.routes.js";
import contactImportRoutes from "./routes/contact-import.routes.js";

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

app.use("/api/contacts", contactRoutes);
app.use("/api/imports", contactImportRoutes);


app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;