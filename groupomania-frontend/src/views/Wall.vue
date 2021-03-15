<template>
  <div class="wall">
    <div v-if="this.editMode">
      <ModifyPost :postToEdit="postToEdit" @edit-mode-status="updateEditModeStatus" />
    </div>
    <NewPost />
    <div id= "postList">
      <h1>Publications récentes</h1>
      <div :id="'post'+item.id" class="card post-card" v-for="item in posts" :key="item.id">
        <div class="card-header">
          <div class="card-header__postInfos">
            <h2 class="card-title">{{item.User.username}}</h2>
            <h3 class="card-subtitle text-muted">{{ new Date(item.updatedAt) | moment("Do MMMM YYYY à HH:mm") }}</h3>
          </div>
          <div class="card-header__postActions">
            <button v-if="(currentUser.userId === item.UserId)"
              type="button"
              data-toggle="modal"
              data-target="#editPostModal"
              data-backdrop="static"
              data-keyboard="false"
              title="Modifier"
              class="btn btn-action btn-left fas fa-edit"
              @click="getPostToEdit"
              :data-postid="item.id" 
              :data-userid="item.UserId">
            </button>
            <button v-if="(currentUser.userId === item.UserId) || (currentUser.isAdmin)"
              type="button"
              title="Supprimer"
              class="btn btn-delete btn-right fas fa-trash-alt"
              @click="deletePost" 
              :data-postid="item.id" 
              :data-userid="item.UserId">
            </button>
          </div>
        </div>
        <div v-if="item.content !== null" class="card-body card-content">
          <FormatContent :brutContent="item.content"></FormatContent>
        </div>
        <img :src="item.attachment" class="card-img-bottom" alt=""/>
        <div class="card-footer text-muted">
          <div class="btn-group" role="group" aria-label="PostReactions">
            <button class="btn btn-sm btn-reaction likes fas fa-heart"> {{item.likes}}</button>
            <button class="btn btn-sm btn-reaction dislikes fas fa-heart-broken"> {{item.dislikes}}</button>          
          </div>
          <button type="button" class="btn btn-sm btn-action" @click="getPostToComment" :data-postid="item.id" :data-userid="item.UserId">Commenter</button>
        </div>
        <div v-if="(item.Comments.length > 0)" class="card-footer card-footer-secondary">
          <a :href="'#post'+item.id" :id="'show-comments-'+item.id" @click="showComments" :data-postid="item.id">Afficher les commentaires ({{item.Comments.length}})</a>
        </div>
        <div v-if="commentMode && (item.id == postToComment)">
          <NewComment :postToComment="item.id" @comment-mode-status="updateCommentModeStatus"/>
        </div>
        <div v-for="post of isCommentsShowing" :key="post.id">
          <CommentsList v-if="post.isShowComments && (post.id == item.id)" :commentsToShow="item.Comments"/>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
import NewPost from "@/components/NewPost.vue";
import ModifyPost from "@/components/ModifyPost.vue";
import FormatContent from "@/components/FormatContent.vue";
import PostService from '../services/post.service';
import NewComment from '../components/NewComment.vue';
import CommentsList from '../components/CommentsList.vue';
//import urlRegex from '../utils/url-regex';
export default {
  name: "Wall",
  components: {
    NewPost,
    ModifyPost,
    FormatContent,
    NewComment,
    CommentsList
  },
  data() {
    return {
      posts: '',
      editMode: false,
      commentMode: false,
      postToEdit: '',
      postToComment: '',
      isCommentsShowing: []
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    //On récupère toutes les publications
    PostService.getAllPosts().then(
      response => {
        this.posts = response.data;
        console.log(response.data);
        for (let post of this.posts) {
          post.isShowComments = false;
        }
      },
      error => {
        if (error.response.status === 401) {
            this.$store.dispatch('auth/logout');
            console.log('Votre connexion a expiré, veuillez vous reconnecter !')
            this.$router.push('/login');
        } else {
          console.log(error);
        }
      }
    );
  },
  methods: {
    deletePost(e) {
      const postId = e.target.dataset.postid;
      const userId = e.target.dataset.userid;
      PostService.deletePost(postId, userId).then(
        response => {
          console.log(response.data.message);
          window.location.reload()
        },
        error => {
          console.log(error);
        }
      );
    },
    getPostToEdit(e) {
      for (let post of this.posts) {
        if (post.id == e.target.dataset.postid) {
          this.postToEdit = post;
          console.log(this.postToEdit);
        }
      }
      this.editMode = true;
    },
    getPostToComment(e) {
      this.postToComment = e.target.dataset.postid;
      this.commentMode = true;
    },
    showComments(e) {
      let showCommentElt = document.getElementById('show-comments-'+e.target.dataset.postid);
      let itemPos = 0;
      for (let post of this.posts) {
        if (post.id == e.target.dataset.postid) {
          if (post.isShowComments == false) {
            post.isShowComments = true;
            this.isCommentsShowing.push(post);
            //this.commentsPostToShow = post;
            showCommentElt.textContent = "Masquer les commentaires";
          } else {
            post.isShowComments = false;
            for (let item of this.isCommentsShowing) {
              if (item.id == post.id) {
                itemPos = this.isCommentsShowing.indexOf(item);
                this.isCommentsShowing.splice(itemPos, 1);
              }
            }
            showCommentElt.textContent = `Afficher les commentaires (${post.Comments.length})`;
          }
        }
      }
    },
    updateEditModeStatus(payload) {
      this.editMode = payload.editMode;
      window.location.reload();
    },
    updateCommentModeStatus(payload) {
      this.commentMode = payload.commentMode
      window.location.reload();
    }
  }
};
</script>

<style lang="scss">
@import '../scss/_variables.scss';
.wall {
  margin: auto;
  max-width: 750px;
}
#postList {
  margin-top: 1rem;
}
.post-card {
  margin: 0.8rem 0 0 0;
}
.card {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;
    color: map-get($colors, secondary-font-color);
    &__postActions {
      .btn-right {
        margin-left: 0.2rem;
      }
    }
  }
  &-content {
    background-color: white;
    p {
      margin: 0;
    }
  }
  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    color: map-get($colors, secondary-font-color);
    &-secondary {
      justify-content: center;
      a {
        color: map-get($colors, secondary-font-lighter-color);
      }
    }
  }
}
.text-muted {
      color: map-get($colors, secondary-font-lighter-color)!important;
}
</style>