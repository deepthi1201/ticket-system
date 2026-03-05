const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket
} = require("../controllers/ticketController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTicket);
router.get("/", authMiddleware, getTickets);
router.put("/:id", authMiddleware, updateTicket);
router.delete("/:id", authMiddleware, deleteTicket);

module.exports = router;