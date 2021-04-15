const models = require('../models');
const jwtUtils = require('../utils/jwtUtils');

exports.createComment = (req, res, next) => {
  const currentUser = jwtUtils.getUserInfo(req.headers.authorization);
  models.Post.findOne({
    where: {
      id: req.params.postId,
    }
  })
  .then(post => {
    models.Comment.create({
      content: req.body.content,
      UserId: post.UserId,
      PostId: post.id
    })
    .then(newComment => res.status(201).json({ message: 'Commentaire crée !' }))
    .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(404).json({ error: 'Publication non trouvée !' }));
};

exports.modifyComment = (req, res, next) => {
  const currentUser = jwtUtils.getUserInfo(req.headers.authorization);
  models.Comment.findOne({
    where: {
      id: req.params.commentId,
      UserId: currentUser.userId,
      PostId: req.params.postId
    }
  })
  .then(comment => {
    models.Comment.update({content: req.body.content}, {
      where: {
        id: comment.id,
        UserId: comment.UserId,
        PostId: comment.PostId
      }
    })
    .then(() => res.status(200).json({ message: 'Commentaire modifié !' }))
    .catch(error => res.status(500).json({ error: 'Modification échouée! '}))
  })
  .catch(error => res.status(404).json({ error: 'Commentaire non trouvé !' }));
};

exports.deleteComment = (req, res, next) => {
  const currentUser = jwtUtils.getUserInfo(req.headers.authorization);
  let creatorId = '';
  if (currentUser.isAdmin && req.body.userId) {
    creatorId = req.body.userId;
  } else {
    creatorId = currentUser.userId;
  };
  models.Comment.findOne({
    where: {
      id: req.params.commentId,
      PostId: req.params.postId,
      UserId: creatorId
    }
  })
  .then(comment => {
    models.Comment.destroy({
      where: {
        id: comment.id,
        UserId: comment.UserId,
        PostId: comment.PostId
      }
    })
    .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
    .catch(error => res.status(500).json({ error: 'Suppression échouée !'}));
  })
  .catch(error => res.status(404).json({ error: 'Commentaire non trouvé !' }));
};