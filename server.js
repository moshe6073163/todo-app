const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const configRoutes = require('./routes/configRoutes');
const mongoose = require("mongoose");
require('dotenv').config();
const mongoURL = process.env.MONGO_URL;


app.use(express.json());
app.use(logger);

configRoutes(app);



app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});

app.listen(3000, () => console.log('Server running on port 3000'));

mongoose.connect(mongoURL)
.then(()=>{
    console.log("DB - connected!");
}).catch(err=> {
    console.log("DB - not connected!", err.message);
})

module.exports = {
    mongoose
}