const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then((conn)=>{
    console.log("DB Connected to",conn.connection.host);
})
.catch(err=>{
    console.log("DD Connection failed", err.message);
})

module.exports= mongoose;