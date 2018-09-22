const ObjectID = require('mongodb').ObjectID;

const Specs = {};

//Retrieves all words from a users collection, ordered by time added to the collection
Specs.getAllSpecs = (req, res, db) => {
  db.collection('specs').find({}).toArray( (err, r) => {
    if(err) res.status(500).send(err);
    else res.send(r.slice(0,20));
  });
};

Specs.addSpec = (req, res, db) => {
  db.collection('specs').insertOne({'json': req.body.json, 'csv': req.body.csv, 'ratings': []}, (err, r) => {
    if(err) res.status(500).send(err);
    else res.send(r).ops[0];
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
  db.collection('spec').findOneAndUpdate({'_id': req.body._id}, {$push: {ratings: {
    'user': req.body.user,
    'rating': req.body.rating
  }}}, {returnOriginal: false}, (err, r) => {
    if(err) res.status(500).send(err);
    else if(r.value) res.send(r.value);
    else res.status(404).send('Spec not found');
  });
};

Specs.addWord = (req, res, db) => {
  db.collection('specs').findOne({'email': req.body.email}, (err, r) => {
    if(err) res.send(err);
    else if(r) {
      db.collection('specs').findOneAndUpdate({'email': req.body.email}, {$push: {characters: {
        '_id': new ObjectID(),
        'dateCreated': Date.now(),
        'simplified': req.body.simplified,
        'traditional': req.body.traditional,
        'pinyins': req.body.pinyins,
        'categories': req.body.categories,
        'def': req.body.def
      }}}, {returnOriginal: false}, (err, r) => {
        if(err) {
          res.status(500).send(err);
        }
        else res.send(r.value);
      });
    }
    else {
      db.collection('specs').insertOne({'email': req.body.email, characters: [{
        '_id': new ObjectID(),
        'dateCreated': Date.now(),
        'simplified': req.body.simplified,
        'traditional': req.body.traditional,
        'pinyins': req.body.pinyins,
        'categories': req.body.categories,
        'def': req.body.def
      }]}, (err, r) => {
        if(err) res.send(err);
        else res.send(r.ops[0]);
      });
    }
  });
};

Specs.modifyWord = (req, res, db) => {
  db.collection('specs').findOne({'email': req.body.email, 'characters._id': new ObjectID(req.body._id)}, (err, r) => {
    if(err) res.status(500).send(err);
    else if(!r) {
      res.status(404);
      res.send('User or character not found.');
    }
    else {
      db.collection('specs').findOneAndUpdate({'email': req.body.email, 'characters._id': new ObjectID(req.body._id)}, {$set: {
        'characters.$.simplified': req.body.simplified===undefined?r.characters.find(x => x._id === req.body._id).simplified:req.body.simplified, 
        'characters.$.traditional': req.body.traditional===undefined?r.characters.find(x => x._id === req.body._id).traditional:req.body.traditional, 
        'characters.$.pinyins': req.body.pinyins===undefined?r.characters.find(x => x._id === req.body._id).pinyins:req.body.pinyins,
        'characters.$.categories': req.body.categories===undefined?r.characters.find(x => x._id === req.body._id).categories:req.body.categories,
        'characters.$.def': req.body.def===undefined?r.characters.find(x => x._id === req.body._id).def:req.body.def
      }}, {returnOriginal: false}, (err2, r2) => {
        if(err2) res.status(500).send(err2);
        else res.send(r2.value);
      });
    }
  });
};

Specs.deleteWord = (req, res, db) => {
  db.collection('Specs').findOneAndUpdate({'email': req.body.email}, {$pull: {characters: {'_id': new ObjectID(req.body._id)}}}, {returnOriginal: false}, (err, r) => {
    if(err) {
      res.status(500);
      res.send(err);
    }
    else if(!r.value) {
      res.status(404);
      res.send('User not found.');
    }
    else res.send('Word removed successfully.');
  });
};
module.exports = Specs;