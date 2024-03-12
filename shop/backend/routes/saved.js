const express = require('express');
const { MongoClient } = require('mongodb');
const CryptoJS = require("crypto-js");
const {ValidateEmail, ValidatePass} = require('../common/funcs');
const router = express.Router();

const url = 'mongodb://localhost:27017';
const dbName = 'first';
const secret = 'blabla';

async function query(func) {
  // Use connect method to connect to the server
  const client = new MongoClient(url);
  let findResult;
  try {
      // Connect to the MongoDB cluster
      await client.connect();
      console.log('Connected successfully to server');
      const db = client.db(dbName);
      const collection = db.collection('users');
      findResult = await func(collection);

  } catch (e) {
      console.error(e);
  } finally {
      // Close the connection to the MongoDB cluster
      await client.close();
      return findResult;
      
  }
}

/* GET users listing. */
router.get('/', function(req, res) {
  query(function(collection){
    return collection.find({active: true}).toArray();
  })
  .then((results) => {
    return res.send(JSON.stringify(results.map((item) => {
      return {
        user: item.user, 
        email: item.email
      };
    })));
  })
  .catch(() => {
    console.error;
  });
});

router.post('/login', function(req, res) {
  let err = {
    password: null,
    email: null,
    success: true
  };
  if(!ValidateEmail(req.params.email)){
    err.email = "Email not valid";
    err.success = false;
  }
  if(!ValidatePass(req.params.password)){
    err.password = "Password not valid";
    err.success = false;
  }
  if(err.success){
    query(function(collection){
      return collection.find({email: req.params.email, active: true}).limit(1).toArray();
    })
    .then((results) => {
      if(results.length){
        let bytes  = CryptoJS.AES.decrypt(results[0].password, secret);
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        if( originalText === req.params.password){
          return res.send(JSON.stringify(true));
        } else {
          return res.send(JSON.stringify("Wrong password"));
        }
      } else {
        return res.send(JSON.stringify("Email not found"));
      }   
    })
    .catch((err) => {
      console.log(err);
      console.error;
      return res.send(JSON.stringify(err));
    });
  } else {
    return res.send(JSON.stringify(err));p
  }
});


router.post('/register', function(req, res) {
  let err = {
    euser: null,
    eemail: null,
    epass1: null,
    epass2: null,
    success: true
  }
  if(req.body.params){
    if(!ValidateEmail(req.body.params.email)){
      err.eemail = "Email not valid";
      err.success = false;
      console.log("here");
    }
    if(req.body.params.user.length < 4 || req.body.params.user.length > 30){
      err.euser = "User name must between 4-30 characters";
      err.success = false;
      console.log("here");
    }
    if(!ValidatePass(req.body.params.password)){
      console.log("here");
      err.epass1 = "Password not valid";
      err.success = false;
    }
    if(!ValidatePass(req.body.params.repassword) || req.body.params.repassword != req.body.params.password){
      err.epass2 = "Validation password not valid";
      err.success = false;
    }
  } else {
    return res.send(JSON.stringify("Nooooooo"));
  }
  if(err.success){
    // let pass = CryptoJS.AES.encrypt(req.body.password, secret).toString();
    // let bytes  = CryptoJS.AES.decrypt(pass, secret);
    // let originalText = bytes.toString(CryptoJS.enc.Utf8);
    // check for MAX sid value
    query(function(collection){
      console.log("getting last id");
      ret = collection.find().sort({sid:-1}).limit(1).toArray();
      console.log(ret);
      return ret.length? ret : [{sid: 1000}];
    })
    .then((results) => {
      console.log("**** " + results[0].sid);
      // insert new user to the database
      query(function(collection){
        return collection.insertOne({
          sid: results[0].sid + 1,
          user: req.body.params.user,
          email: req.body.params.email,
          password: CryptoJS.AES.encrypt(req.body.params.password, secret).toString(),
          active: true
        });
      })
      .then((results) => {
        console.log("Printing result"+results);
        return res.send(JSON.stringify(results));
      })
      .catch((err) => {
        console.log("Not created new one"+err);
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




router.put('/details', function(req, res) {
  let err = {
    user: null,
    email: null,
    newEmail: null,
    success: true
  }
  if(!ValidateEmail(req.body.email)){
    err.email = "Email not valid";
    err.success = false;
  }
  if(req.body.newEmail && !ValidateEmail(req.body.newEmail)){
    err.newEmail = "Email not valid";
    err.success = false;
  }
  if(req.body.user && req.body.user.length > 30){
    err.user = "User name to long";
    err.success = false;
  }
  if(err.success){
    query(function(collection){
      return collection.updateOne(
        {email: req.body.email, active: true},
        [{
          $set: { 
            "user" : req.body.user? req.body.user : "$user",
            "email" : req.body.user? "$email" : req.body.newEmail
          }
        }]
      );
    })
    .then((results) => {
      console.log(results);
      return res.send(JSON.stringify(results));
    })
    .catch((err) => {
      console.log(err);
      console.error;
      return res.send(JSON.stringify(err));
    });
  } else {
    return res.send(JSON.stringify(err));
  }
});
router.get('/register', function(req, res) {
  //router.use(express.static("public"));
  return res.sendFile("Registration.html", {root: "public/register"});


});
router.put('/password', function(req, res) {
  let err = {
    password: null,
    rewpassword: null,
    email: null,
    success: true
  }
  if(!ValidateEmail(req.body.email)){
    err.email = "Email not valid";
    err.success = false;
  }
  if(!ValidatePass(req.body.password)){
    err.password = "Password not valid";
    err.success = false;
  }
  if(!ValidatePass(req.body.repassword) || req.body.repassword != req.body.password){
    err.repassword = "Validation password not valid";
    err.success = false;
  }
  if(err.success){
      query(function(collection){
        return collection.updateOne(
          {email: req.body.email, active: true},
          [{
            $set: { 
              "password": CryptoJS.AES.encrypt(req.body.password, secret).toString()
            }
          }]
        );
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
  } else {
    return res.send(JSON.stringify(err));
  }
});

router.delete('/', function(req, res) {
  let err = {
    password: null,
    email: null,
    success: true
  };
  if(!ValidateEmail(req.body.email)){
    err.email = "Email not valid";
    err.success = false;
  }
  if(!ValidatePass(req.body.password)){
    err.password = "Password not valid";
    err.success = false;
  }
  if(err.success){
    query(function(collection){
      return collection.find({email: req.body.email, active: true}).limit(1).toArray();
    })
    .then((results) => {
      if(results.length){
        let bytes  = CryptoJS.AES.decrypt(results[0].password, secret);
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        if( originalText === req.body.password){
          query(function(collection){
            return collection.updateOne(
              {email: req.body.email, active: true},
              [{
                $set: { 
                  "active": false
                }
              }]
            );
          })
          .then((results) => {
            console.log(results);
            return res.send(JSON.stringify(results));
          })
          .catch((err) => {
            console.log(err);
            console.error;
            return res.send(JSON.stringify(err));
          });
        } else {
          return res.send(JSON.stringify("Wrong password"));
        }
      } else {
        return res.send(JSON.stringify("Email not found"));
      }   
    })
    .catch((err) => {
      console.log(err);
      console.error;
      return res.send(JSON.stringify(err));
    });
  } else {
    return res.send(JSON.stringify(err));
  }
});
// router.delete('/', function(req, res) {
//   let err = {
//     email: null,
//     success: true
//   }
//   if(!ValidateEmail(req.body.email)){
//     err.email = "Email not valid";
//     err.success = false;
//   }
//   if(err.success){
//       query(function(collection){
//         return collection.updateOne(
//           {email: req.body.email, active: true},
//           [{
//             $set: { 
//               "active": false
//             }
//           }]
//         );
//       })
//       .then((results) => {
//         console.log(results);
//         return res.send(JSON.stringify(results));
//       })
//       .catch((err) => {
//         console.log(err);
//         console.error;
//         return res.send(JSON.stringify(err));
//       })
//   } else {
//     return res.send(JSON.stringify(err));
//   }
// });

module.exports = router;










