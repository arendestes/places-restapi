
const uuid = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');



const getPlaceBypid = async (req, res, next) => {
    const returnID = req.params.pid;
    
    let place;
    try{
        place = await Place.findById(returnID);
    } catch(err){
        const error = new HttpError("Could not get place from data base.", 500)
        return next(error);
    }
    
    if (!place) {
        return next(new HttpError('Could not find place with pid.', 404));
    };
    res.json({ place:  place.toObject({getters: true})});
}




const getPlacesByuid = async (req, res, next) => {
    const returnID = req.params.uid;

    let places;
    try{
        places = await Place.find({creator: returnID});
    } catch(err){
        const error = new HttpError("Could not find user places in database.");
        return next(error);
    };
    
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find places with uid.', 404));
    }
    res.json({ places: places.map(place => place.toObject({getters: true})) });
}






const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError("Please enter valid data in all fields.", 422));
    };
    const { title, description, creator, address } = req.body;

    let user;
    try{
        user = await User.findById(creator);
    }catch(err){
        const error = new HttpError('Creating place failed. Could not find creating user. Please try agin later.', 500);
        return next(error);
    };

    if(!user){
        const error = new HttpError("Could not find user creating place.", 404);
        return next(error);
    };

    let location;
    try{
        location = await getCoordsForAddress(address);
    } catch (error){
        return next(error);
    }

    const newPlace = new Place({
        title, description, creator, address, location, image: 'https://images.unsplash.com/photo-1520542099817-0d19524eccca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    })


    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newPlace.save({session: sess});
        user.places.push(newPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
        
    } catch(err){
        const error = new HttpError("Creating place failed. Try agin.", 500);
        return next(error);
    }
    

    
    res.status(201).json({ place: newPlace });
}






const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError("Please enter valid data in all fields.", 422));
    };

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let placeToUpdate;

    try{
        placeToUpdate = await Place.findById(placeId);
    } catch(err){
        const error = new HttpError('Could not update place in database.', 500);
        return next(error);
    };

    
    placeToUpdate.title = title;
    placeToUpdate.description = description;
    
    try{
       await placeToUpdate.save();
    } catch(err){
        const error = new HttpError("Could not update place in database", 500);
    };

    res.status(200).json({ place: placeToUpdate });
};






const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId);
    } catch(err){
        const error = new HttpError("Could not delete place in database.", 500);
        return next(error);
    };
    
    try{
        await place.remove();
    } catch(err){
        const error = new HttpError("Could not delete place in database.", 500);
        return next(error);
    };

    res.status(200).json({ message: "Place deleted." })
};

exports.getPlaceBypid = getPlaceBypid;
exports.getPlacesByuid = getPlacesByuid;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;


