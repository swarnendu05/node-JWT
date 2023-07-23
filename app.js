const express = require('express')
const app = express();
const path = require('path');
const DB = require('./config/db');
const cookiesPaerser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookiesPaerser());

const authRoutes = require('./routes/authRoutes');
const { verifyAuth, checkUser } = require('./middlewares/authMiddleware');

app.get('*', checkUser)
app.use('/', authRoutes);
app.get('/store', verifyAuth, checkUser, (req, res, next) => {

    console.log("25", req.user);
    res.render('store');
})

DB.connection.on('error', (err) => {

    console.log("Could not connect to DB", err.message);
})
DB.connection.on('open', () => {

    app.listen(3000, () => {
        console.log("Server up at 3000");
    })
})
