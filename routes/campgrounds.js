const express = require('express')
const router = express.Router();
const catchAsync = require('../utilities/catchAsyncError')
const { isLoggedIn, validateCampground, isAuthor } = require('../middlewares')
const campgroundController = require('../controllers/campgrounds');

//campgrounds routes
router.route('')
    .get(catchAsync(campgroundController.allCampgrounds))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground))

router.get('/new', isLoggedIn, campgroundController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm))

module.exports = router