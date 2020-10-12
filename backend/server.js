import express from 'express';
import path from 'path';
// import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute'
import uploadRoute from './routes/uploadRoute';
import referenceRoute from './routes/referenceRoute';
import recreationRoute from './routes/recreationRoute';


const mongodbUrl = config.MONGODB_URL;
let gfsReferences;
let gfsRecreations;

//Connect to MongoDB
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=> {
    console.log("db connected success")
  })
  .catch((err) => {console.log("db connection failed because ", err)})

mongoose.connection.on('connected', () => {
    console.log('Connection opened');
    gfsReferences = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'references'
    });

    gfsRecreations = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'recreations'
    });
})

const app = express();

/*Middleware*/ 
// app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/uploads", uploadRoute);
app.use("/api/references", referenceRoute);
app.use("/api/recreations", recreationRoute);

app.get('/api/image/references/:filename', (req, res) => {
  gfsReferences.find({ filename: req.params.filename }).toArray((err, files) => {
    // Check if file
    console.log("filename is ", req.params.filename)
    if (!files[0] || files.length === 0) {
      return res.status(404).json({
        err: 'No file exist'
      });
    }

    // Check if image
    if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png') {
      gfsReferences.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

app.get('/api/image/recreations/:filename', (req, res) => {
  gfsRecreations.find({ filename: req.params.filename }).toArray((err, files) => {
    // Check if file
    console.log("filename is ", req.params.filename)
    if (!files[0] || files.length === 0) {
      return res.status(404).json({
        err: 'No file exist'
      });
    }

    // Check if image
    if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png') {
      gfsRecreations.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

//config server to serve files inside images folder
app.use('/static', express.static(path.join(__dirname, '/../images')))
app.listen(5001, () => {console.log("Server started at http://localhost:5001")})