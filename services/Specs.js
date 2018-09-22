const ObjectID = require('mongodb').ObjectID;

const Specs = {};

//Retrieves all words from a users collection, ordered by time added to the collection
Specs.getAllSpecs = (req, res, db) => {
  db.collection('specs').find({}).toArray( (err, r) => {
    if(err) res.status(500).send(err);
    else {
      const min = r.length-20;
      res.send(r.slice(Math.max(0, min)).reverse());
    }
  });
};

Specs.addSpec = (req, res, db) => {
  db.collection('specs').insertOne({
    'json': req.body.json, 
    'data': req.body.data, 
    'ratings': [], 
    'title': req.body.title, 
    'user': req.body.user,
    'timestamp': Date.now()
  }, (err, r) => {
    if(err) {res.status(500).send(err); console.log(err);}
    else res.send(r.ops[0]);
  });
};

Specs.findSpec = (req, res, db) => {
  db.collection('specs').findOne({'json': req.body.json}, (err, r) => {
    if(err) res.status(500).send(err);
    else if(r) res.send(r);
    else res.status(404).send('Spec not found');
  });
};

Specs.addRating = (req, res, db) => {
  console.log('id:', req.body._id);
  db.collection('specs').findOneAndUpdate({'_id': new ObjectID(req.body._id)}, {$push: {ratings: {
    'user': req.body.user,
    'rating': req.body.rating
  }}}, {returnOriginal: false}, (err, r) => {
    if(err) res.status(500).send(err);
    else if(r.value) res.send(r.value);
    else res.status(404).send('Spec not found');
  });
};
module.exports = Specs;
