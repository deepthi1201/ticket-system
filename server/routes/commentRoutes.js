const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* Add comment to a ticket */
router.post("/:ticketId", async (req, res) => {
  try {
    const { message } = req.body;
    const { ticketId } = req.params;

    const comment = await prisma.comment.create({
      data: {
        message,
        ticketId: Number(ticketId),
      },
    });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

/* Get comments of a ticket */
router.get("/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        ticketId: Number(ticketId),
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

module.exports = router;