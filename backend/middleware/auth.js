const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/auth.config');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, jwtConfig.secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Token non valable !'});
        } else {
          next()
        };
      });
    } else {
      res.status(401).json({error: `Token d'authentification manquant !`})
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !'});
  }
}

/*module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: `Token d'authentification manquant !` })
  }
  try {
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, jwtConfig.secret);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    if ((!isAdmin) && (req.body.userId && req.body.userId !== userId)) {
      throw `Vous n'avez pas les droits !`;
    } else {
      next();
    }
  } catch (error) {
    return res.status(401).json({ error: error | 'Requête non authentifiée' });
  }
}*/