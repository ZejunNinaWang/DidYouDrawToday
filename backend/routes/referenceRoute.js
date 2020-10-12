import express from 'express';
import Reference from '../models/referenceModel';
import User from '../models/userModel';
import { isAuth, isAdmin } from '../util';
import Recreation from '../models/recreationModel';
import { cloudinary } from '../cloudinary';

const referenceRoute = express.Router();

referenceRoute.get('/', async (req, res) => {
    try{
        const category = req.query.category ? { category: req.query.category } : {};
        const searchKeyword = req.query.searchKeyword
          ? { $or: [
                {name: {
                    $regex: req.query.searchKeyword,
                    $options: 'i', //case insensitive
                  } 
                },
                {description: {
                    $regex: req.query.searchKeyword,
                    $options: 'i', //case insensitive
                  } 
                }
              ]
            }
          : {};

        // const references = await Reference.find({ ...category, ...searchKeyword});
        // const referenceIds = references.map(reference => reference._id);
        const referenceIds = await Reference.distinct("_id",{ ...category, ...searchKeyword});
        if(referenceIds.length == 0){
          res.status(204).send(referenceIds);
        } else {
          res.status(200).send(referenceIds);
        }
        

    }catch(err){
        res.status(500).send({msg: error.message});
    }
});

referenceRoute.get('/:id/recreations', async (req, res) => {
  try {
    console.log("req.params.id is ", req.params.id);
    const recreationIds = await Recreation.distinct("_id", {reference: req.params.id});
    if(recreationIds.length == 0) {
      res.status(204).send(recreationIds);
    } else {
      res.status(200).send(recreationIds);
    }
    
    
  } catch (error) {
    res.status(500).send({msg: error.message});
  }

})

referenceRoute.get('/:id', async (req, res) => {
    try{
        const reference = await Reference.findById(req.params.id);
        if (reference) {
          res.status(200).send({data: reference});
        } else {
          res.status(404).send({ message: 'Reference Not Found.' });
        }
    } catch (error) {
        res.status(500).send({msg: error.message});
    }
    
});

referenceRoute.delete("/:id", isAuth, async(req, res) => {
  console.log("in delete reference api");
  try {
    const reference = await Reference.findById(req.params.id);
    if(reference){
      if(reference.numRecreations == 0){
        const {image_public_id} = reference;
        await reference.remove();
        
        res.status(204).send({message: 'Reference deleted.'})

        try {
          const deleteImageResult = await cloudinary.uploader.destroy(image_public_id, {
            invalidate: true,
          });
          console.log("deleteImageResult is ", deleteImageResult);
          
        } catch (imageDeleteError) {
          //TODO: handle fail to delete image error
          console.log("Failed to delete image ", imageDeleteError);
        }

      } else {
        res.status(400).send({message: 'You cannot delete the reference because it already has recreations.'});
      }
    } else {
      res.status(404).send({ message: 'Reference Not Found.' });
    }
    
  } catch (error) {
    res.status(500).send({msg: error.message});
  }
})
  
referenceRoute.post("/", isAuth, async (req, res) => {
    try {
        const reference = new Reference({
            name: req.body.name,
            image_public_id: req.body.image,
            description: req.body.description,
            source: req.body.source,
            user: req.user._id,
        });

        console.log("reference is ", reference)
  
        const newReference = await reference.save();

        res.status(201).send({data: newReference});

    } catch (error) {
        res.status(500).send({msg: error.message});
    }
});


export default referenceRoute;