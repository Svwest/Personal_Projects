const express = require('express');
const { MongoClient } = require('mongodb');

const {ValidateEmail, ValidatePass} = require('../common/funcs');
const router = express.Router();

const url = 'mongodb://localhost:27017';
const dbName = 'Exam';


async function query(func) {
  // Use connect method to connect to the server
  const client = new MongoClient(url);
  let findResult;
  try {
      // Connect to the MongoDB cluster
      await client.connect();
      console.log('Connected successfully to Server');
      const db = client.db(dbName);
      const collection = db.collection('products');
      findResult = await func(collection);
      
  } catch (e) {
      console.error(e);
  } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
     
      return findResult;
      
      
      
  }
}


router.post('/newProduct', async function(req, res) {
 let err = {
  ecode: null,
  ename: null,  
  eprice: null,
  ecategory: null,
  eimage:null,
  einventory: null,
    success: true
  }
  
  if(req.body.params){
    
    if(req.body.params.code.length !=8){
      err.ecode = "Code must be in length of 8";
      err.success = false;
      
    }
    if(req.body.params.name.length >100){
      err.ename = "Name must be less than 100 chars";
      err.success = false;
      
    }

     
    

   if(req.body.params.image.length >255){
    err.eimage = "Maximum 255 chars";
    err.success = false;
   
 }



  } else {
    return res.send(JSON.stringify("Nooooooo"));
  }
  if(err.success){
   
    query(function(collection){
     return collection.find().sort({sid:-1}).limit(1).toArray()
    })
    .then ((results) => {
      
      // insert new item to the database
      query(function(collection){
        
        return collection.insertOne({
        
          sid: results[0].sid + 1,
          code: req.body.params.code,
          name: req.body.params.name,  
          price: req.body.params.price,
          category: req.body.params.category,
          image:req.body.params.image,
          entrydate:req.body.params.entrydate,
          inventory: req.body.params.inventory, 
          active: 1
        });
      })
      .then((results) => {
        console.log(results);
        return res.send(JSON.stringify(results));
      })
      .catch((err) => {
        console.log(err);
        console.error;
        return res.send(JSON.stringify(err));
      })
    })
    .catch((err) => {
      console.log(+err);
      console.error;
      return res.send(JSON.stringify(err));
    })
    
  } else {
    return res.send(JSON.stringify(err));
  }
});


  router.get('/gallery', function(req, res) {
    query(function(collection){
      return collection.find({ active: 1}).toArray();
  }, 'users')
    .then((results) => {
      return res.send(JSON.stringify(results.map((item) => {
        return {
         // sid: item.sid, 
          code: item.code,
          name: item.name,      
          price: item.price,
         // category: item.category,
         // entrydate: item.entrydate,
        // inventory: item.inventory,
          image: item.image,
         // active: item.active
        };
      })));
    })
    .catch(() => {
      console.error;
    });
  });

module.exports = router;










