const HttpError = require('../models/http-error');
const uuid = require('uuid');
const { validationResult } = require('express-validator');

let USER_DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Billy Bobbs Gator Farm and Petting Zoo',
        description: 'Great place to wrestle a gator, pet a gator, ride a gator... pretty much anything goes.',
        creator: 'u1',
        address: '100 Swamp Britches Ln',
        location: {
            lat: 30.4457497,
            lng: -91.1871759
        },
        image: 'https://images.unsplash.com/photo-1520542099817-0d19524eccca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'p3',
        title: 'Billy Bobbs Gator Farm and mini golf',
        description: 'Great place to wrestle a gator, pet a gator, ride a gator... pretty much anything goes.',
        creator: 'u1',
        address: '100 Swamp Britches Ln',
        location: {
            lat: 30.4457497,
            lng: -91.1871759
        },
        image: 'https://images.unsplash.com/photo-1520542099817-0d19524eccca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'p2',
        title: 'Ricky Roys Gator Farm and Petting Zoo',
        description: 'Great place to wrestle a gator, pet a gator, ride a gator... pretty much anything goes.',
        creator: 'u2',
        address: '100 Swamp Britches Ln',
        location: {
            lat: 30.4457497,
            lng: -91.1871759
        },
        image: 'https://images.unsplash.com/photo-1520542099817-0d19524eccca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    }
];

const getPlaceBypid = (req, res, next) => {
    const returnID = req.params.pid;
    const place = USER_DUMMY_PLACES.find(place => place.id === returnID);
    if (!place) {
        return next(new HttpError('Could not find place with pid.', 404));
    };
    res.json({ place });
}

const getPlacesByuid = (req, res, next) => {
    const returnID = req.params.uid;
    const places = USER_DUMMY_PLACES.filter(place => place.creator === returnID);
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find places with uid.', 404));
    }
    res.json({ places });
}

const createPlace = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError("Please enter valid data in all fields.", 422);
    }
    const { title, description, creator, address, location } = req.body;
    const newPlace = { id: uuid.v4(), title, description, creator, address, location };
    USER_DUMMY_PLACES.push(newPlace);
    res.status(201).json({ place: newPlace });
}

const updatePlace = (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.pid;
    const placeToUpdate = { ...USER_DUMMY_PLACES.find(place => place.id === placeId) };
    const placeIndex = USER_DUMMY_PLACES.findIndex(place => place.id === placeId);
    placeToUpdate.title = title;
    placeToUpdate.description = description;
    USER_DUMMY_PLACES[placeIndex] = placeToUpdate;
    res.status(200).json({ place: USER_DUMMY_PLACES[placeIndex] });
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    USER_DUMMY_PLACES = USER_DUMMY_PLACES.filter(place => place.id !== placeId);
    res.status(200).json({ message: "Place deleted." })
};

exports.getPlaceBypid = getPlaceBypid;
exports.getPlacesByuid = getPlacesByuid;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;