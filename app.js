const express = require('express');
const authRoute = require('./routes/auth');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoute = require('./routes/posts');

dotenv.config();

const app = express();
app.use(express.json());
//connect to database
mongoose.connect( process.env.DB_CONNECT,
                { useNewUrlParser: true, useUnifiedTopology: true },
                  console.log('Connect to DB!')
                );

//Router middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute)



app.listen(3000, () => console.log('Server Up and running'));