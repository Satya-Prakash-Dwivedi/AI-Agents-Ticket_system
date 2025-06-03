import express from "express"
import { createTicket, getTicket, getTickets } from "../controllers/ticket"
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/", authenticate, getTickets);
router.get("/:id", authenticate, getTicket);
router.post("/", authenticate, createTicket);

export default router;