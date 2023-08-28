const path = require('path');
const express = require('express')

const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const viewRouter = require('./routes/viewRoutes')
const router = require('./routes/index')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')


const app = express()


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



app.use(helmet());

// routes
app.use('/api', router)
app.use('', viewRouter)
app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server`, 400))
})

app.use(globalErrorHandler)

module.exports = app