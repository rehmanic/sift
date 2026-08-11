import { Router } from "express";
import * as productService from "../services/productService";
import * as userService from "../services/userService";

const router = Router();

router.get("/", (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  const products = productService.getAll({
    category: category as string | undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });
  res.json(products);
});

router.get("/categories", (_req, res) => {
  res.json(productService.getCategories());
});

router.get("/:id", (req, res) => {
  const product = productService.getById(req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

router.get("/:id/confidence", (req, res) => {
  const userId = (req.query.userId as string) || "u1";
  const user = userService.getById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const confidence = productService.getConfidence(req.params.id, user);
  if (!confidence) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(confidence);
});

router.get("/:id/alternatives", (req, res) => {
  const userId = (req.query.userId as string) || "u1";
  const user = userService.getById(userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const alternatives = productService.getAlternatives(req.params.id, user);
  res.json(alternatives);
});

export default router;
