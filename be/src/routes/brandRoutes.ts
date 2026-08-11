import { Router } from "express";
import * as brandService from "../services/brandService";

const router = Router();

router.get("/:id", (req, res) => {
  const brand = brandService.getById(req.params.id);
  if (!brand) {
    res.status(404).json({ error: "Brand not found" });
    return;
  }
  res.json(brand);
});

export default router;
