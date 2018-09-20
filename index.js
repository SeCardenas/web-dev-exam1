'use strict';
require('dotenv').config(); //Set environment variables from private file
//const Users = require('./services/Users');
const Collections = require('./services/Collections');
//const Tools = require('./services/Tools');
const MongoClient = require('mongodb');
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

const mongoSetup = (callback) => {
  const port = process.env.MONGODB_PORT || 27017;
  const url = `mongodb://localhost:${port}`;
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const uri = `mongodb://${username}:${password}@cluster0-shard-00-00-keqfb.mongodb.net:27017,cluster0-shard-00-01-keqfb.mongodb.net:27017,cluster0-shard-00-02-keqfb.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;

  //Connect to mongo
  MongoClient.connect(uri, {useNewUrlParser: true}, function (err, client) {
    if (err) throw err;
    else console.log('Successfully connected to mongoDB');
    //Afterwards instruction, client stands for a mongoClient connected to mongoAtlas instance
    callback(client);
  });
};

//Setting up endpoints
const expressSetup = (mongoClient) => {

  const db = mongoClient.db('app');
  //mongoimport --db consulta --collection consulta --type json --jsonArray --file file.json

  //CRUD Users
  app.get('/users', (req, res) => {
    res.send('express app');
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

mongoSetup(expressSetup);
