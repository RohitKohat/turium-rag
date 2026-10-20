const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); // 

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// HTTP Request Logging (JSON format for production readiness)
app.use(morgan('{"method": ":method", "url": ":url", "status": ":status", "responseTime": ":response-time ms"}'));

// Routes
app.use('/api/ingest', require('./routes/ingest'));
app.use('/api/items', require('./routes/items'));
app.use('/api/query', require('./routes/query'));
app.use('/api/related', require('./routes/related'));
app.use('/api/health', require('./routes/health'));

// Error Handler (must be the last middleware)
app.use(require('./middleware/errorHandler'));

module.exports = app;