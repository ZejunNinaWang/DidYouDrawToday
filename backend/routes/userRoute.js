import express from 'express';
import User from '../models/userModel';
import { getToken, isAuth } from '../util';
import Recreation from '../models/recreationModel';
import Reference from '../models/referenceModel';

const userRoute = express.Router()

userRoute.post("/signin", async (req, res) => {
    // Find user with requested email 
    User.findOne({ email : req.body.email }, function(err, user) { 
      if (err) { 
        return res.status(400).send({ 
            message : "Failed to find user because " + err
        }); 
      } 

      if (user === null) { 
          return res.status(400).send({ 
              message : "User not found."
          }); 
      } 
      else { 
          if (user.validPassword(req.body.password)) { 
              return res.status(201).send({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
                token: getToken(user),
              });
          } 
          else { 
              return res.status(400).send({ 
                  message : "Wrong Password"
              }); 
          } 
      } 
    }); 


});


//update
userRoute.put('/:id', isAuth, async (req, res) => {
  // const userId = req.params.id;
  // const user = await User.findById(userId);
  // if (user) {
  //   user.name = req.body.name || user.name;
  //   user.email = req.body.email || user.email;
  //   user.password = req.body.password || user.password;
  //   const updatedUser = await user.save();
  //   res.send({
  //     _id: updatedUser.id,
  //     name: updatedUser.name,
  //     email: updatedUser.email,
  //     avatar: updatedUser.avatar,
  //     isAdmin: updatedUser.isAdmin,
  //     token: getToken(updatedUser),
  //   });
  // } else {
  //   res.status(404).send({ message: 'User Not Found' });
  // }
})

userRoute.post("/register", async (req, res) => {
  // Creating empty user object 
  let newUser = new User(); 

  // Initialize newUser object with request data 
  newUser.name = req.body.name, 

  newUser.email = req.body.email 

  // Call setPassword function to hash password 
  newUser.setPassword(req.body.password); 

  // Save newUser object to database 
  newUser.save((err, user) => { 
      if (err) { 
          return res.status(400).send({ 
              message : "Failed to add user because " + err 
          }); 
      } 
      else { 
          //User added successfully
          return res.status(201).send({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            token: getToken(user),
          });
      } 
  }); 
})

userRoute.put('/:id/avatars', isAuth, async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if(user){
//     user.avatar = req.body.fileName || user.avatar;
//     const updatedUser = await user.save();
//     res.status(200).send({
//       _id: updatedUser.id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       avatar: updatedUser.avatar,
//       isAdmin: updatedUser.isAdmin,
//       token: getToken(updatedUser),
//     });
//   } else {
//     res.status(404).send({ message: 'User Not Found' });
//   }
});

userRoute.get('/:id/recreations', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(user){
      const recreationIds = await Recreation.distinct("_id", {user: req.params.id});
      console.log("recreationIds is ", recreationIds)
      if(recreationIds.length == 0) {
        res.status(204).send([]);
      } else {
        res.status(200).send(recreationIds);
      }
  
    } else {
      res.status(404).send({msg: 'User Not Found'});
    }
    
  } catch (error) {
    res.status(500).send({msg: error});
  }

})

userRoute.get('/:id/references', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(user){
      const referenceIds = await Reference.distinct("_id", {user: req.params.id});
      if(referenceIds.length == 0) {
        res.status(204).send(referenceIds);
      } else {
        res.status(200).send(referenceIds);
      }
  
    } else {
      res.status(404).send({msg: 'User Not Found'});
    }
    
  } catch (error) {
    res.status(500).send({msg: error.message});
  }

})

 
export default userRoute;