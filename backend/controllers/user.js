const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');
const models = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const buffer = Buffer.from(email);
  const maskedEmail = buffer.toString('base64');
  const password = req.body.password;
  models.User.findOne({
    where: {
      [Op.or]: [
        { email: maskedEmail },
        { username: username }
      ]
    }
  })
  .then(user => {
    if (!user) {
      bcrypt.hash(password, 10)
      .then(hash => {
        const newUser = models.User.create({
          username: username,
          email: maskedEmail,
          password: hash,
          isAdmin: false
        })
        .then(newUser => res.status(201).json({ message: 'Utilisateur crée ! username: ' + newUser.username }))
        .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    } else {
      return res.status(409).json({ error: 'Cet utilisateur existe déjà !' })
    };
  })
  .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const buffer = Buffer.from(email);
  const maskedEmail = buffer.toString('base64');
  const password = req.body.password;
  models.User.findOne({
    where: {email: maskedEmail}
  })
  .then(user => {
    if (user) {
      bcrypt.compare(password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(400).json({ error: 'Mot de passe incorrect !' })
          }
          res.status(200).json({
            userId: user.id,
            username: user.username,
            email: email,
            token: jwtUtils.generateToken(user),
            isAdmin: user.isAdmin,
          });
        })
        .catch(error => res.status(500).json({ error }))
    } else {
      return res.status(404).json({ error: 'Utilisateur non trouvé !' })
    };
  })
  .catch(error => res.status(500).json({ error }));
};

exports.getUserProfile = (req, res, next) => {
  const currentUser = jwtUtils.getUserInfo(req.headers.authorization);
  if (currentUser.isAdmin || (currentUser.userId == req.params.userId)) {
    models.User.findOne({
      where: {id: req.params.userId}
    })
    .then(user => {
      const clearEmail = Buffer.from(user.email, 'base64').toString('utf8');
      res.status(200).json({
        userId: user.id,
        username: user.username,
        email: clearEmail,
        isAdmin: user.isAdmin,
      });
    })
    .catch(error => res.status(404).json({ error: 'Utilisateur non trouvé !'}));
  } else {
    res.status(403).json({ error: 'Vous ne disposez pas des droits nécéssaires !' });
  }
};

exports.deleteUser = (req, res, next) => {
  const currentUser = jwtUtils.getUserInfo(req.headers.authorization);
  if (currentUser.isAdmin || (currentUser.userId == req.params.userId)) {
    models.User.findOne({
      where: {id: req.params.userId}
    })
    .then(user => {
      models.Post.findAll({
        where: {UserId: user.id}
      })
      .then(posts => {
        for(let post of posts) {
          if (post.attachment != null) {
            console.log(post.attachment);
            let filename = post.attachment.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
              if (err) throw err;
              console.log(`images/${filename} was deleted`)
            })
          }
        }
        models.User.destroy({
          where: {id: user.id}
        })
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
        .catch(error => res.status(500).json({ error: 'Suppression échouée !' }));
      })
      .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(404).json({ error: 'Utilisateur non trouvé !'}))
  } else {
    res.status(403).json({ error: 'Vous ne disposez pas des droits nécéssaires !'})
  }
};