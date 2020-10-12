import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, index: true, dropDups: true},
    avatar: { type: String, required: false, default: '' },

    hash: {type: String},
    salt: {type: String},
    

    isAdmin: {type: Boolean, required: true, default: true}, //user is admin by default
    level: { type: Number, default: 0, required: false },
    

    recreations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recreation', required: true}],
    references: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reference', required: true}],

    weiboLink: {type: String},
    twitterLink: {type: String},
    insLink: {type: String}
});

// Method to set salt and hash the password for a user 
// setPassword method first creates a salt unique for every user 
// then it hashes the salt with user password and creates a hash 
// this hash is stored in the database as user password 
userSchema.methods.setPassword = function(password) { 
     
    // Creating a unique salt for a particular user 
       this.salt = crypto.randomBytes(16).toString('hex'); 
     
       // Hashing user's salt and password with 1000 iterations, 
       //64 length and sha512 digest 
       this.hash = crypto.pbkdf2Sync(password, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
   }; 
     
   // Method to check the entered password is correct or not 
   // valid password method checks whether the user 
   // password is correct or not 
   // It takes the user password from the request  
   // and salt from user database entry 
   // It then hashes user password and salt 
   // then checks if this generated hash is equal 
   // to user's hash in the database or not 
   // If the user's hash is equal to generated hash  
   // then the password is correct otherwise not 
   userSchema.methods.validPassword = function(password) { 
       var hash = crypto.pbkdf2Sync(password,  
       this.salt, 1000, 64, `sha512`).toString(`hex`); 
       return this.hash === hash; 
   }; 

const User = mongoose.model("User", userSchema);

export default User;