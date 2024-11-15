const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const Blog = require('./models/Blog');
const User = require('./models/User');
const userRoutes = require('./routes/users');
const blogRoutes = require('./routes/blogs');
const keys = require('./config/keys');

const app = express();

// MongoDB connection
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');

// Routes
app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);

// Home Route
app.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render('index', { user: req.session.user, blogs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

