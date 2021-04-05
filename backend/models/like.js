'use strict';

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    value: DataTypes.BOOLEAN,
  }, {});
  Like.associate = function(models) {
    //associations can be defined here
    models.Like.belongsTo(models.Post);
    models.Like.belongsTo(models.User);
  };
  return Like;
};