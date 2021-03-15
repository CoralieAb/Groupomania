const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

router.post('/:postId', auth, commentCtrl.createComment);
router.put('/:postId/:commentId', auth, commentCtrl.modifyComment);
router.delete('/:postId/:commentId', auth, commentCtrl.deleteComment);

module.exports = router;