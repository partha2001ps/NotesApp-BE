const express = require('express');
const userController = require('../controllers/userController');
const NotesController = require('../controllers/NotesController');
const { auth_middleware } = require('../middleware/auth');
const userRoute = express.Router()

userRoute.post('/', userController.signup)
userRoute.post('/signin', userController.signIn)
userRoute.post('/reset-password', userController.resetPassword);
userRoute.post('/reset-password/:OTP', userController.newpassword);
userRoute.post('/notes',auth_middleware, NotesController.addNotes)
userRoute.get('/notes',auth_middleware,NotesController.getNotes)
userRoute.put('/notes/:id', NotesController.editNotes)
userRoute.delete('/notes/:id',auth_middleware,NotesController.deleteNotes)
module.exports=userRoute