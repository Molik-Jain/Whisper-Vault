const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

     
const app = express();
const port = 8000;


// Database Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database connected succesfully"))
    .catch(() => console.log("Database not connected"))
    
//middleware 
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({
    extended:false
}))

app.use('/', require('./routes/authRoutes'))

app.listen(port, () => console.log(`Server is runnig on port ${port}`)) 