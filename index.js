'use strict';
require('dotenv').config(); //Set environment variables from private file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

//
//Main entry point. Responsible of setting express app, mongoDB connections 
//and serving frontend app. Exposes all services to the client (Users, Collections and Tools)
//

const app = express();

app.use(bodyParser.json({
  type: 'application/json'
}));
app.use(bodyParser.raw({
  type: 'multipart/form-data',
  limit: '20mb'
}));
app.use(cors());

//Setting up endpoints
const expressSetup = () => {
  //CRUD Users
  app.post('/csv', (req, res) => {
    
  });

  //Serving react resources
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  //For any request that does not match any other endpoint, return app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
  });

  startServer();
};

//Begin listening to requests
const startServer = () => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('Server successfully run');
  });
};

expressSetup();
