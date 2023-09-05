const path = require('path');
const express = require('express')
const https = require('https')
const fs = require('fs')

const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const viewRouter = require('./routes/viewRoutes')
const router = require('./routes/index')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')


const app = express()

const options = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./certificate.crt')
};



app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(cors());
app.options('*', cors());

app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));



app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'self'", "https://js.stripe.com", "https://api.mapbox.com"],
            frameSrc: ["'self'", "https://js.stripe.com"],
            workerSrc: ["'self'", "blob:"],
            connectSrc: ["'self'", "https://api.mapbox.com", "https://events.mapbox.com/"],
        }
    }
}));

// routes
app.get('/get_img/:img_type/:img_name', (req, res) => {
    const {img_type, img_name} = req.params
    const filePath = path.join(__dirname, 'public/img', img_type, img_name);
    return res.sendFile(filePath)
})
app.use('/api', router)
app.use('', viewRouter)
app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server`, 400))
})

app.use(globalErrorHandler)

const server = https.createServer(options, app);

module.exports = server