require('dotenv').config();

const express = require('express');
const cors = require('cors');

const ticketRoutes = require('./src/routes/tickets');

const app = express();

app.use(cors());
app.use(express.json());

// Health check — useful to verify the deployed server is actually alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tickets', ticketRoutes);

// Basic 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Basic error handler — keeps error shape consistent instead of
// leaking stack traces to the client
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
