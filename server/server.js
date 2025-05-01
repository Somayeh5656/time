require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes= require('./routes/users')


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users',userRoutes);

mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Server is working!');
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));