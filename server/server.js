require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const createAccountRoutes= require('./routes/createAccount')
const signInRoutes= require('./routes/signIn')
const tasksRoutes=require('./routes/tasks')
const diariesRoutes= require('./routes/diaries')
const goalsRoutes=require('./routes/goals')
const emotionsRoutes=require('./routes/emotions')

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/createAccount',createAccountRoutes);
app.use('/api/signIn',signInRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/diaries',diariesRoutes)
app.use('/api/goals',goalsRoutes)
app.use('/api/emotions',emotionsRoutes)


mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));



const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.json({message:'Server is working!'});
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

