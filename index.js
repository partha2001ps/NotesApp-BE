const mongoose = require('mongoose');
const cors = require('cors')
const express = require('express');
const { MONGOOSE_URL, PORT } = require('./utilities/config');
const userRoute = require('./routes/userRouter');

const app = express()
app.use(cors());
app.use(express.json())
app.use('/', userRoute);

mongoose.connect(MONGOOSE_URL)
    .then(() => {
    console.log('connection mongoDB')
    })
    .catch((e) => {
    console.log('connection error',e)
    })
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})