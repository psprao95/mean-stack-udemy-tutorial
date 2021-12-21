const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts')
const extractFile = require('../middleware/file')
const checkAuth = require('../middleware/check-auth')

router.get('/api/posts',PostsController.getPosts);
router.get('/api/posts/:id', PostsController.getPost);
router.post('/api/posts', checkAuth, extractFile, PostsController.addPost);
router.put('/api/posts/:id', checkAuth, extractFile,PostsController.updatePost);
router.delete('/api/posts/:id', checkAuth, PostsController.deletePost);

module.exports = router;
