// requiring the mongoose and setting up the Schema and connection to the MONGO DB database 

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

mongoose.connect("mongodb://Dyodgorov:6233phone@ds117834.mlab.com:17834/web322_assignment6");


// defining the userSchema

var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{ "dateTime": Date, "userAgent": String }]


});

let User;

// defining the initialize() function 

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://Dyodgorov:6233phone@ds117834.mlab.com:17834/web322_assignment6");
        db.on('error', (err) => {

            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);

            resolve();
        });
    });
};

// defining the registerUser(userData) function

module.exports.registerUser = function (userData) {
    return new Promise((resolve, reject) => {

        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        }
        else {
            bcrypt.genSalt(10, function (err, salt) {

                // Generate a "salt" using 10 rounds
                bcrypt.hash(userData.password, salt, function (err, hash) {
                    if (err) {
                        reject("There was an error encrypting the password");
                    }
                    else {// encrypt the password
                        userData.password = hash;
                        var newUser = new User(userData);

                        newUser.save((err) => {
                            if (err) {
                                if (err.code == 11000) {
                                    reject("User Name already taken")
                                }
                                else {
                                    reject("There was an error creating the user:" + err);
                                }
                            }
                            else {
                                resolve();
                            }
                        })

                    }

                });
            })





        }
    });
}

//defining the  checkUser(userData) function 

module.exports.checkUser = function (userData) {
    return new Promise((resolve, reject) => {
        User.find({ userName: userData.userName }).exec().then((users) => {
            if (users.length == 0) {
                reject("Unable to find user: " + userData.userName)
            }
           
            else {

                bcrypt.compare(userData.password,users[0].password).then((res) => {
                    
                    if(res===true)
                    {
                        users[0].loginHistory = { dateTime: (new Date()).toString(), userAgent: userData.userAgent };
                        User.update({ userName: users[0].userName },
                            { $set: { loginHistory: users[0].loginHistory } }).exec().then(() => {
        
                                resolve(users[0]);
                            }).catch((err) => {
                                reject("There was an error verifying the user: " + err);
                            });
                    }
                    else if(res===false)
                    {
                        reject("Incorrect password for user : "+userData.userName);
                    }


                   });
                
            }


        }).catch((err) => {
            reject("Unable to find user : " + userData.userName);
        })
    });
}

