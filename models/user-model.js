const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const myUserSchema = new Schema(
  {         //1st argument -> structure object
    fullname: {type: String},
    username: {type: String},

    //SIGN UP/LOG IN FORM users-----------------
    encryptedPassword: {type: String},

    //GOOGLE users------------------------------
    googleId: {type: String},

    //FACEBOOK users----------------------------
    facebookId: {type: String}
  },
  {        //2nd argument -> additional settings
    timestamps: true
    //timestamps creates two additional fields: "createdAt" & "updatedAt"
  }
);

const UserModel = mongoose.model('User', myUserSchema);
                                // |
                                //'User' -> 'users' -> db.users.find()


module.exports = UserModel;
