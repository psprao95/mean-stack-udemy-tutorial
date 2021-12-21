const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user')
const path = require('path')

const app = express();
const port = 3000;

app.use(bodyParser.json())
app.set('port', port);
app.use('/images', express.static(path.join('backend/images')))

mongoose.connect('mongodb+srv://testdb:test123@cluster0.fhjkg.mongodb.net/mean-tutorial?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected to database...')
  })
  .catch(() => {
    console.log('connection failed');
  });


// solving the CORS
app.use('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, Accept, Content-Type,X-Requested-With,Authorization");
  res.setHeader('Access-Control-Allow-Methods', "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  next();
})


app.use(postsRoutes);
app.use("/api/users", userRoutes)

module.exports = app;
