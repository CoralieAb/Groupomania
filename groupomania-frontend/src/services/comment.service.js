import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/posts/';

class CommentService {
  createComment(post, comment, currentUser) {
    console.log(post);
    console.log(comment.content);
    console.log(currentUser.userId);
    return axios.post(API_URL + post, {
      content: comment.content,
      postId: post,
      userId: currentUser.userId
      },
      {headers: authHeader()}
    );
  }
  modifyComment(comment) {
    return axios.put(API_URL + comment.postId + '/' + comment.id, {
      content: comment.content,
      commentId: comment.id,
      postId: comment.postId,
      userId: comment.userId
    },
    {headers: authHeader()}
    );
  }
  deleteComment(postId, userId, commentId) {
    return axios.delete(API_URL + postId + '/' + commentId, {
      headers: authHeader(),
      data: {
        postId: postId,
        userId: userId,
        commentId: commentId
      }
    });
  }
}

export default new CommentService();