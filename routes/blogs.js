const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();

router.get('/create', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/users/login'); 
    }
    res.render('createBlog'); 
});

router.post('/create', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.send('All fields are required.'); 
    }

    const newBlog = new Blog({
        title,
        content,
        user: req.session.user._id 
    });

    await newBlog.save(); 
    res.redirect('/'); 
});

// Like our blog route
router.post('/:id/like', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    blog.likes += 1;
    await blog.save();
    res.redirect(`/blogs/${req.params.id}`);
});

// Comment ourr blog route
router.post('/:id/comment', async (req, res) => {
    const { comment } = req.body;
    const blog = await Blog.findById(req.params.id);
    blog.comments = blog.comments || [];
    blog.comments.push(comment);
    await blog.save();
    res.redirect(`/blogs/${req.params.id}`);
});

// View in the single blog
router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('user');
    res.render('singleBlog', { blog });
});

module.exports = router;
