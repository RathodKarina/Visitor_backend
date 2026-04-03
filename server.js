const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visits', require('./routes/visits'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/security', require('./routes/security'));

app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Error:', err));


// server
const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

module.exports = app;