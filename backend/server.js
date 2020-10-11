const express = require('express');
const mongoose = require('mongoose');
//const keys = require('./config/keys');

// create express app
const app = express();
// set middleware
app.use(express.json());

// connect to db
//keys.mongodbURI
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB connection successful.'))
  .catch(err => console.log(`MongoDB connection error => ${err}`));

// use routes
app.use('/api/goods', require('./routes/api/GoodsRoutes'));
app.use('/api/auth', require('./routes/api/AuthRoutes'));

// setup port
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
}
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
