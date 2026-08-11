import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import brandRoutes from "./routes/brandRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/users", userRoutes);

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
