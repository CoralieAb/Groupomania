const fs = require('fs');
const models = require('../models');
const jwtUtils = require('../utils/jwtUtils');

exports.getAllPosts = (req, res, next) => {
  models.Post.findAll({
    include: [
    {
      model: models.User,
      attributes: ['username']
    },
    {
      model: models.Comment,
      include: [
        {
          model: models.User,
          attributes: ['username']
        }
      ],
    }],
    order: [['createdAt', 'DESC']]
  })
  .then(posts => {
    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(200).json({ message: 'Aucune publication à afficher' });
    }
  })
  .catch(error => res.status(500).json({ error }));
};

exports.createPost = (req, res, next) => {
  const currentUser = jwtUtils.getUserInfo(req.headers.authorization);
  let content = req.body.content;
  if ((req.body.content === '') || (req.body.content === 'null')) {
    content = null;
  }
  let postObject = req.file ?
    {
      content: content,
      UserId: currentUser.userId,
      attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
      content: content,
      UserId: currentUser.userId,
    };
  if (postObject.attachment) {
    models.Post.create({content: postObject.content, UserId: postObject.UserId, attachment: postObject.attachment})
    .then(newPost => res.status(201).json({ message: 'Publication créée !' }))
    .catch(error => res.status(500).json({ error }));
  } else {
    models.Post.create({content: postObject.content, UserId: postObject.UserId, attachment: null})
    .then(newPost => res.status(201).json({ message: 'Publication créée !' }))
    .catch(error => res.status(500).json({ error }));
  };
};

exports.modifyPost = (req, res, next) => {
  const currentUser = jwtUtils.getUserInfo(req.headers.authorization);
  let content = req.body.content;
  if ((req.body.content === '') || (req.body.content === 'null')) {
    content = null;
  }
  let postObject = req.file ?
    {
      content: content,
      id: req.params.postId,
      UserId: currentUser.userId,
      attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : {
      content: content,
      id: req.params.postId,
      UserId: currentUser.userId,
      oldAttachment: req.body.oldAttachment
    };
  models.Post.findOne({
    where: {
      id: postObject.id,
      UserId: postObject.UserId
    }
  })
  .then(post => {
    if (post.attachment == null) {
      if (postObject.attachment) {
        // On update le Post avec le nouveau contenu et le nouvel attachment
        models.Post.update({content: postObject.content, attachment: postObject.attachment}, {
          where: {id: post.id, UserId: post.UserId}
        })
        .then(() => res.status(200).json({ message: 'Publication modifiée !' }))
        .catch(error => res.status(500).json({ error: 'Modification échouée !' }));
      } else {
        // On update uniquement le contenu
        models.Post.update({content: postObject.content}, {
          where: {id: post.id, UserId: post.UserId}
        })
        .then(() => res.status(200).json({ message: 'Publication modifiée !' }))
        .catch(error => res.status(500).json({ error: 'Modification échouée !' }));
      }
    } else if (post.attachment !== null) {
      //On récupère le nom du fichier contenu dans le champ attachment du post trouvé
      const filename = post.attachment.split('/images')[1];
      if (postObject.attachment) {
        // On supprime l'ancienne images du dossier images // Puis on update le Post avec le nouveau contenu et le nouvel attachment
        fs.unlink(`images/${filename}`, () => {
          models.Post.update({content: postObject.content, attachment: postObject.attachment}, {
            where: {id: post.id, UserId: post.UserId}
          })
          .then(() => res.status(200).json({ message: 'Publication modifiée !' }))
          .catch(error => res.status(500).json({ error: 'Modification échouée !' }));
        });
      } else {
        if (postObject.oldAttachment == null) {
          // On supprime l'ancienne image du dossier images // Puis on update le Post avec le nouveau contenu et l'attachment valant NULL
          fs.unlink(`images/${filename}`, () => {
            models.Post.update({content: postObject.content, attachment: null}, {
              where: {id: post.id, UserId: post.UserId}
            })
            .then(() => res.status(200).json({ message: 'Publication modifiée !' }))
            .catch(error => res.status(500).json({ error: 'Modification échouée !' }));
          });
        } else {
          // On update uniquement le contenu
          models.Post.update({content: postObject.content}, {
            where: {id: post.id, UserId: post.UserId}
          })
          .then(() => res.status(200).json({ message: 'Publication modifiée !' }))
          .catch(error => res.status(500).json({ error: 'Modification échouée !' }));
        }
      }
    }
  })
  .catch(error => res.status(404).json({ error: 'Publication non trouvée !' }));
};

exports.deletePost = (req, res, next) => {
  const currentUser = jwtUtils.getUserInfo(req.headers.authorization);
  let creatorId = '';
  if (currentUser.isAdmin && req.body.userId) {
    creatorId = req.body.userId;
  } else {
    creatorId = currentUser.userId;
  };
  models.Post.findOne({
    where: {
      id: req.params.postId,
      UserId: creatorId
    }
  })
  .then(post => {
    if (post.attachment !== null) {
      const filename = post.attachment.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        models.Post.destroy({
          where: {
            id: post.id,
            UserId: post.UserId
          }
        })
        .then(() => res.status(200).json({ message: 'Publication supprimée !' }))
        .catch(error => res.status(500).json({ error: 'Suppression échouée !' }));
      });
    } else {
      models.Post.destroy({
        where: {
          id: post.id,
          UserId: post.UserId
        }
      })
      .then(() => res.status(200).json({ message: 'Publication supprimée !' }))
      .catch(error => res.status(500).json({ error: 'Suppression échouée !' }));
    }
  })
  .catch(error => res.status(404).json({ error: 'Publication non trouvée !' }));
};

exports.addLike = (req, res, next) => {
  const currentUser = jwtUtils.getUserInfo(req.headers.authorization);
  const userReaction = Number(req.body.like);
  const like = models.Like.findOne({
    where: {
      UserId: currentUser.userId,
      PostId: req.params.postId
    }
  })
  .then(like => {
    if (like === null) {
      switch (userReaction) {
        case 1:
          models.Like.create({
            value: 1,
            PostId: req.params.postId,
            UserId: currentUser.userId,
          })
          .then(() => res.status(201).json({ message: 'Like ajouté !' }))
          .catch(error => res.status(500).json({ error }));
          break;
        case -1:
          models.Like.create({
            value: 0,
            UserId: currentUser.userId,
            PostId: req.params.id
          })
          .then(() => res.status(201).json({ message: 'Dislike ajouté !' }))
          .catch(error => res.status(500).json({ error }));
          break;
        default:
          res.status(400).json({ error });
      }
    } else {
      switch (userReaction) {
        case 1:
          console.log('coucou');
          console.log(like.UserId);
          models.Like.update({value: 1}, {
            where: {
              UserId: like.UserId,
              PostId: like.PostId
            }
          })
          .then(() => res.status(200).json({ message: 'Like ajouté !' }))
          .catch(error => res.status(500).json({ error }));
          break;
        case 0:
          models.Like.destroy({
            where: {
              UserId: like.UserId,
              PostId: like.PostId
            }
          })
          .then(() => res.status(200).json({ message: 'Like/dislike supprimé !' }))
          .catch(error => res.status(500).json({ error }));
          break;
        case -1:
          models.Like.update({value: 0}, {
            where: {
              UserId: like.UserId,
              PostId: like.PostId
            }
          })
          .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
          .catch(error => res.status(500).json({ error }));
          break;
        default:
          res.status(400).jsons({ error });
      }
    }
  })
  .catch(error => res.status(500).json({ error }));
};