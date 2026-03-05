const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Ticket
exports.createTicket = async (req, res) => {
  try {

    const { title, description, priority } = req.body;

    console.log("User from token:", req.user);
    console.log("Body:", req.body);

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        userId: req.user.userId
      }
    });

    // 🔴 REALTIME EVENT
    const io = req.app.get("io");
    io.emit("ticketUpdated");

    res.json(ticket);

  } catch (error) {

    console.error("Ticket error:", error);
    res.status(500).json({ error: error.message });

  }
};

// Get All Tickets
exports.getTickets = async (req, res) => {
  try {

    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.userId }
    });

    res.json(tickets);

  } catch (error) {

    res.status(500).json({ error: "Error fetching tickets" });

  }
};

// Update Ticket
exports.updateTicket = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const ticket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: { status }
    });

    // 🔴 REALTIME EVENT
    const io = req.app.get("io");
    io.emit("ticketUpdated");

    res.json(ticket);

  } catch (error) {

    res.status(500).json({ error: "Error updating ticket" });

  }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.ticket.delete({
      where: { id: Number(id) }
    });

    // 🔴 REALTIME EVENT
    const io = req.app.get("io");
    io.emit("ticketUpdated");

    res.json({ message: "Ticket deleted" });

  } catch (error) {

    res.status(500).json({ error: "Error deleting ticket" });

  }
};