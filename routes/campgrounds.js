const express = require('express')
const router = express.Router();
const catchAsync = require('../utilities/catchAsyncError')
const { isLoggedIn, validateCampground, isAuthor, isVerified } = require('../middlewares')
const campgroundController = require('../controllers/campgrounds');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

//campgrounds routes
router.route('')
    .get(catchAsync(campgroundController.allCampgrounds))
    .post(isLoggedIn, upload.array('campground[img]'), validateCampground, catchAsync(campgroundController.createCampground))


router.get('/new', isLoggedIn, isVerified, campgroundController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('campground[img]'), validateCampground, catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm))

module.exports = router