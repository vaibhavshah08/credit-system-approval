const express = require('express');
const db = require('./db');
const dataRoutes = require('./routes/dataRoutes');
const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

app.use('/api', dataRoutes);
app.use('/api', customerRoutes);
app.use('/api', loanRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
