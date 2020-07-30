
const uuid = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');



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
        await newPlace.save();
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
        throw new HttpError("Please enter valid data in all fields.", 422);
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






const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if(!USER_DUMMY_PLACES.find(place => place.id === placeId)){
        throw new HttpError("Could not find place to delete.", 404);
    }
    USER_DUMMY_PLACES = USER_DUMMY_PLACES.filter(place => place.id !== placeId);
    res.status(200).json({ message: "Place deleted." })
};

exports.getPlaceBypid = getPlaceBypid;
exports.getPlacesByuid = getPlacesByuid;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;


