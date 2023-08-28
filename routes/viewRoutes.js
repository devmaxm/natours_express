const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const viewRouter = express.Router();

viewRouter.use(viewsController.alerts);

viewRouter.get('/', authController.isLoggedIn, viewsController.getOverview);

viewRouter.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
viewRouter.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
viewRouter.get('/me', authController.authProtect, viewsController.getAccount);

viewRouter.get('/my-tours', authController.authProtect, viewsController.getMyTours);

viewRouter.post(
  '/submit-user-data',
  authController.authProtect,
  viewsController.updateUserData
);

module.exports = viewRouter;
