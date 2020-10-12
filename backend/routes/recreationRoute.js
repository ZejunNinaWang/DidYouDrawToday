import express from 'express';
import Reference from '../models/referenceModel';
import Recreation from '../models/recreationModel';
import User from '../models/userModel';
import { isAuth, isAdmin } from '../util';
import { cloudinary } from '../cloudinary';

const recreationRoute = express.Router();

recreationRoute.post("/", isAuth, async (req, res) => {
    console.log("in post recreation api")
    try {
        const recreation = new Recreation({
            image_public_id: req.body.image,
            description: req.body.description,
            source: req.body.source,
            user: req.user._id,
            reference: req.body.referenceId,
        });

        console.log("recreation is ", recreation)
  
        const newRecreation = await recreation.save();

        //update reference's numRecreation
        const reference = await Reference.findById(req.body.referenceId);
        reference.numRecreations = reference.numRecreations + 1;
        const updatedReference = await reference.save();

        res.status(201).send({msg: "New Recreation Created", data: newRecreation});

    } catch (error) {
        res.status(500).send({msg: error.message});
    }
});

recreationRoute.get('/', async (req, res) => {
    try {
        // const timeOrder = req.query.timeOrder ? { _id: -1 } : {};
        const recreations = [];
        // console.log("req.params.recreationIds is ", req.query);
        const recreationIds = req.query.recreationIds;
        for(let i = recreationIds.length-1; i >= 0; i--){
            const recreation = await Recreation.findById(recreationIds[i]);
            recreations.push(recreation);
        }
        res.status(200).send({data: recreations});

    } catch (error) {
        res.status(500).send({msg: error.message});
    }
})

recreationRoute.get('/:id', async (req, res) => {
    try {
        const recreation = await Recreation.findById(req.params.id);
        if(recreation){
            res.status(200).send({data: recreation});
        } else {
            res.status(404).send({ message: 'Recreation Not Found.' });
        }
        

    } catch (error) {
        res.status(500).send({msg: error.message});
    }
})

recreationRoute.delete('/:id', async (req, res) => {
    try {
        const recreation = await Recreation.findById(req.params.id);
        
        if(recreation){
            const reference = await Reference.findById(recreation.reference);
            const {image_public_id} = recreation;
            console.log('image_public_id is ', image_public_id);
            await recreation.remove();
            const deleteImageResult = await cloudinary.uploader.destroy(image_public_id, {
                invalidate: true,
            });
            console.log("deleteImageResult is ", deleteImageResult);

            res.status(204).send({msg: 'Recreation Deleted'});
            
            reference.numRecreations = reference.numRecreations - 1;
            const updatedReference = await reference.save();
            
        }else{
            res.status(404).send({ message: 'Recreation Not Found.' });
        }

        

    } catch (error) {
        res.status(500).send({msg: error.message});
    }
})
export default recreationRoute;