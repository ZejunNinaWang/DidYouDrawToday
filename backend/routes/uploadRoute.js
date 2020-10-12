import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto'; //to generate file name
import GridFsStorage from 'multer-gridfs-storage';
import config from '../config';
import { cloudinary } from '../cloudinary';
import { getToken, isAuth } from '../util';



const uploadRoute = express.Router();

const mongodbUrl = config.MONGODB_URL;

//////USING MULTER AND GRIDFS TO STORE IMAGES, NOT USED ANYMORE////////
// const storageReference = new GridFsStorage({
//     url: mongodbUrl,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         //crypto.randomBytes is used to generate names
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'references'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });
// const uploadReference = multer({ storage: storageReference});

// uploadRoute.post("/references", uploadReference.single('image'), (req, res) => {
//   console.log("req.file is" , req.file)
//   res.json({file: req.file});
// });


// const storageRecreations = new GridFsStorage({
//   url: mongodbUrl,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       //crypto.randomBytes is used to generate names
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'recreations'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const uploadRecreation = multer({ storage: storageRecreations});

// uploadRoute.post("/recreations", uploadRecreation.single('image'), (req, res) => {
//   res.json({file: req.file});
// });


uploadRoute.post('/references', isAuth, async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'references',
    });
    res.status(200).send({ public_id: uploadResponse.public_id});
  } catch (error) {
    res.status(500).send({meg: error});
  }
})


uploadRoute.post('/recreations', isAuth, async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'recreations',
    });
    res.status(200).send({ public_id: uploadResponse.public_id});
  } catch (error) {
    res.status(500).send({meg: error});
  }
})

export default uploadRoute;

