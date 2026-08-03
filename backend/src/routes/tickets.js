const express = require('express');
const router = express.Router();

// Phase 2 will implement these:
// router.post('/', ticketsController.createTicket);
// router.get('/', ticketsController.listTickets);
// router.get('/:ticketId', ticketsController.getTicket);
// router.put('/:ticketId', ticketsController.updateTicket);

// Temporary placeholder so the server has something to respond with
// until Phase 2 wires up the real controller logic.
router.get('/', (req, res) => {
  res.json({ message: 'Tickets endpoint placeholder — Phase 2 implements this.' });
});

module.exports = router;
