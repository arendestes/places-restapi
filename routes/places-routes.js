const express = require('express');

const router = express.Router();

const USER_DUMMY_PLACES = [
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

router.get('/:pid', (req, res, next) => {
    const returnID = req.params.pid;
    const place = USER_DUMMY_PLACES.find(place => place.id === returnID);
    res.json({place});
});

router.get('/user/:uid', (req, res, next) => {
    const returnID = req.params.uid;
    const places = USER_DUMMY_PLACES.filter(place => place.creator === returnID);
    res.json({places});
});


module.exports = router;