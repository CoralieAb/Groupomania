const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/auth.config');

module.exports = {
  generateToken(user) {
    return jwt.sign({
      userId: user.id,
      isAdmin: user.isAdmin
    }, jwtConfig.secret,
    {
      expiresIn: '24h'
    })
  },
  getUserInfo(data) {
    const token = data.split(' ')[1];
    try {
      const decodedToken = jwt.verify(token, jwtConfig.secret);
      const userId = decodedToken.userId;
      const isAdmin = decodedToken.isAdmin;
      return {
        userId: userId,
        isAdmin: isAdmin
      }
    }
    catch (err) {
      return err
    }
  }
}