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
app.use(express.json({ limit: "10mb" }));
// app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({
    extended: false
}))

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });
app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/confessRoutes'))

app.listen(port, () => console.log(`Server is runnig on port ${port}`)) 