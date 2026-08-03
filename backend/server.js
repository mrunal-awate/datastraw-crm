require('dotenv').config();

const express = require('express');
const cors = require('cors');

const ticketRoutes = require('./src/routes/tickets');

const app = express();

// Only allow requests from your actual frontend (and localhost during dev).
// FRONTEND_URL is set as an environment variable once the frontend is deployed.
const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // requests with no origin (curl, Postman, server-to-server) are allowed
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
}));
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
