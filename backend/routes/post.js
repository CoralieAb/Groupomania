const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:postId', auth, multer, postCtrl.modifyPost);
router.delete('/:postId', auth, multer, postCtrl.deletePost);
router.post('/:postId/like', auth, postCtrl.addLike);

module.exports = router;