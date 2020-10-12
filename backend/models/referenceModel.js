import mongoose from 'mongoose';

const referenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image_public_id: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //uploader
    source: { type: String, required: true},
    numRecreations: {type: Number, default: 0, required: false}

  });

  const referenceModel = mongoose.model("Reference", referenceSchema );
  export default referenceModel;