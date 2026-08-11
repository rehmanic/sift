import { Router } from "express";
import * as userService from "../services/userService";

const router = Router();

router.get("/:id", (req, res) => {
  const user = userService.getById(req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

router.patch("/:id/preferences", (req, res) => {
  const user = userService.updatePreferences(req.params.id, req.body);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

export default router;
