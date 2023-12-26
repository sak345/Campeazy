if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//imports
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const expressError = require('./utilities/expressError')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const campgroundRouter = require('./routes/campgrounds')
const reviewRouter = require('./routes/reviews')
const userRouter = require('./routes/users')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const dbUrl = process.env.db_url || 'mongodb://127.0.0.1:27017/yelpCamp'

const MongoStore = require('connect-mongo');

//connecting database
//'mongodb://127.0.0.1:27017/yelpCamp'
mongoose.connect(dbUrl)
const db = mongoose.connection
db.on("error", console.error.bind(console, 'Connection Error'))
db.once("open", () => {
    console.log("Database connected!")
})


//configurations
app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(mongoSanitize());

const secret = process.env.secret || 'thiswillbeupdatedinthefuture'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 12 * 60 * 60,
    crypto: {
        secret
    }
})

store.on("error", function (e) {
    console.log("Session store error!", e)
})

//session configuration
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secret: true,//enable only in production mode
        maxAge: 1000 * 60 * 60 * 12
    }
}
app.use(session(sessionConfig))

app.use(flash())

app.use(helmet())

//content security policy configuration
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dl3zvu2pd/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


//passport configuration for user authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to store data inside res.locals to make it visible to /views dir.
app.use((req, res, next) => {
    if (!['/login', '/signUp', '/'].includes(req.originalUrl)) {
        if (req.originalUrl.includes('/reviews') || req.originalUrl.includes('/edit') || req.originalUrl.includes('?_method=DELETE')) {
            req.session.returnTo = req.originalUrl.split('/edit')[0];
            req.session.returnTo = req.session.returnTo.split('?_method=DELETE')[0];
            req.session.returnTo = req.session.returnTo.split('/reviews')[0];
        } else {
            req.session.returnTo = req.originalUrl
        }
    }
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('err')
    res.locals.formData = req.flash('formData')//used to store the formData entered by user to pre-fill the form with this data
    res.locals.currUser = req.user || false;
    next();
})

//home page
app.get('/', (req, res) => {
    res.render('home')
})

//campgrounds routes
app.use('/campgrounds', campgroundRouter)

//reviews routes
app.use('/campgrounds/:id/reviews', reviewRouter)

//users routes
app.use('/', userRouter)

//error handlers
app.all('*', (req, res, next) => {
    next(new expressError('404! Page not found :(', 404));
})

//middleware to get all the error requests and render the error accordingly
app.use((err, req, res, next) => {
    if (!err.message) err.message = "Oh no! Something went wrong! :("
    if (!err.statusCode) err.statusCode = 500;
    if (err.name === 'CastError') {
        err.message = "Sorry! We could not find what you requested for."
        err.statusCode = 400;
    }
    res.status(err.statusCode).render('error', { err });
})

//listener
app.listen(3000, () => {
    console.log("Serving on port: 3000");
})
