import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000/api/posts/';

class PostService {
  getAllPosts() {
    return axios.get(API_URL, { headers: authHeader() });
  }
  createPost(post, currentUser) {
    if (post.attachment == null) {
      return axios.post(API_URL, {
          content: post.content,
          userId: currentUser.userId
        },
        {headers: authHeader()}
      );
    } else {
      let fd = new FormData();
      fd.append("content", post.content);
      fd.append("attachment", post.attachment);
      fd.append("userId", currentUser.userId);
      return axios.post(API_URL, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
    }
  }
  modifyPost(post, currentUser) {
    if (typeof post.newAttachment === "object") {
      let fd = new FormData();
      fd.append("postId", post.id);
      fd.append("content", post.content);
      fd.append("attachment", post.newAttachment);
      fd.append("oldAttachment", post.oldAttachment);
      fd.append("userId", post.userId);
      return axios.put(API_URL + post.id, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
    } else {
      return axios.put(API_URL + post.id, {
          content: post.content,
          postId: post.id,
          userId: post.userId,
          oldAttachment: post.oldAttachment
        },
        {headers: authHeader()}
      );
    }
  }
  deletePost(postId, userId) {
    return axios.delete(API_URL + postId, {
      headers: authHeader(),
      data: {
        postId: postId,
        userId: userId
      }
    });
  }
}

export default new PostService();