const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

router.post('/', ticketsController.createTicket);
router.get('/', ticketsController.listTickets);
router.get('/:ticketId', ticketsController.getTicket);
router.put('/:ticketId', ticketsController.updateTicket);

module.exports = router;
