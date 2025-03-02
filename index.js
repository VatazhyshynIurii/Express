require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const RateLimit = require('express-rate-limit');

const connectDB = require('./config/dbConfig');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 3000;
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

const app = express();
connectDB();

app.use(credentials);
app.use(cors());
app.use(limiter);
app.use(compression());
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes/router'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});