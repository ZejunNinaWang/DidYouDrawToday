import mongoose from 'mongoose';

const recreationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //reference to the User table
    reference: { type: mongoose.Schema.Types.ObjectId, ref: 'Reference', required: true }, //reference to the Reference table
    image_public_id: { type: String, required: true },
    description: {type: String, required: true},
    source: {type: String, required: false}

  },
  {
    timestamps: true,
  }
  );

  const recreationModel = mongoose.model("Recreation", recreationSchema );
  export default recreationModel;