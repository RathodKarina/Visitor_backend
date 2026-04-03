const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visits', require('./routes/visits'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/security', require('./routes/security'));

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// ❌ REMOVE this if exists
// app.listen(...)

// ✅ Export
module.exports = app;