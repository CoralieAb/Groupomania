'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    dislikes: DataTypes.INTEGER
  }, {});
  Post.associate = function(models) {
    //associations can be defined here
    models.Post.hasMany(models.Comment, {onDelete: 'CASCADE', hooks:true});
    models.Post.belongsTo(models.User);
  };
  return Post;
};