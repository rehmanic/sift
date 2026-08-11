import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Sift API",
    version: "1.0.0",
    description: "Purchase Confidence API for LAAM marketplace",
  });
});

app.listen(PORT, () => {
  console.log(`Sift API running at http://localhost:${PORT}`);
});
