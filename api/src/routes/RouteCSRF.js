import express from "express";
import { generateCSRF } from "../middleware/generateCSRF";
import { success } from "zod";

const router = express.Router();

router.get("/", generateCSRF, (req, res) => {
  res.json({
    success: true,
    csrfToken: req.csrfToken,
  });
});

export default router;
