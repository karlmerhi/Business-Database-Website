// require mongoose and setup the Schema
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// require bcrypt to hash passwords
const bcrypt = require("bcryptjs");

// define the user schema
var userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  email: String,
  loginHistory: {
    dateTime: Date,
    userAgent: String,
  },
});
// register the User model using the userSchema
// use the web322_companies collection in the db to store documents
let User;

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(
      "mongodb+srv://kmerhi1:6XmvjtlEYb2lbYVQ@senecaweb.mpjwr.mongodb.net/SenecaWeb?retryWrites=true&w=majority"
    );

    db.on("error", (err) => {
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = (userData) => {
  return new Promise((resolve, reject) => {
    if (userData.password != userData.password2) {
      reject("Passwords do not match");
    } else {
      // create a new user
      bcrypt
        .genSalt(10) // Generate a "salt" using 10 rounds
        .then((salt) => bcrypt.hash(userData.password, salt)) // encrypt the password: "myPassword123"
        .then((hash) => {
          // TODO: Store the resulting "hash" value in the DB
          userData.password = hash;
          let newUser = new User(userData);

          // save the new user
          newUser.save((err) => {
            if (err) {
              if (err.code) {
                reject("User Name already taken");
              } else {
                reject("There was an error creating the user: " + err);
              }
            } else {
              resolve();
            }
          });
        })
        .catch(() => {
          reject("There was an error encrypting the password");
        });
    }
  });
};

module.exports.checkUser = (userData) => {
  return new Promise((resolve, reject) => {
    User.find({ userName: userData.userName })
      .exec()
      .then((users) => {
        if (users.length == 0) {
          reject("Unable to find user: " + userData.userName);
        } else {
          bcrypt
            .compare(userData.password, users[0].password)
            .then((result) => {
              if (result) {
                users[0].loginHistory = {
                  dateTime: new Date().toString(),
                  userAgent: userData.userAgent,
                };
              } else {
                reject("Incorrect Password for user: " + userData.userName);
              }
            });

          User.updateOne(
            { userName: users[0].userName },
            { $set: { loginHistory: users[0].loginHistory } }
          )
            .exec()
            .then(() => {
              resolve(users[0]);
            })
            .catch((err) => {
              reject("There was an error verifying the user: " + err);
            });
        }
      })
      .catch(() => {
        reject("Unable to find user: " + userData.userName);
      });
  });
};
