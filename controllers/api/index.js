const router = require('express').Router();
const bookingsRoute = require('./booking-route');
const bookmarkRoute = require('./bookmarks-route');
const propertyRoute = require('./property-route');
const userRoute = require('./user-route');

router.use('/bookings', bookingsRoute);
router.use('/bookmark', bookmarkRoute);
router.use('/property', propertyRoute);
router.use('/user', userRoute);

module.exports = router;
