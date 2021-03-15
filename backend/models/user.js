const { v4: uuidv4 } = require('uuid');

'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    //associations can be defined here
    models.User.hasMany(models.Post, {onDelete: 'CASCADE', hooks:true});
    models.User.hasMany(models.Comment, {onDelete: 'CASCADE', hooks:true});
  };
  User.beforeCreate((user, _ ) => {
    return user.id = uuidv4();
  })
  return User;
};