<template>
  <div class="commentsList">
    <div class="card comment" v-for="comment of commentsToShow" :key="comment.id">
      <div v-if="editMode && (comment.id == commentToEdit.id)">
        <ModifyComment :commentToEdit="commentToEdit" @edit-mode-status="updateEditModeStatus" />
      </div>
      <div v-if="!editMode && (comment.id !== commentToEdit.id)" class="card-body comment-body">
        <div class = "comment-header">
          <div class = "comment-header__commentInfos">
            <strong class="card-title">{{comment.User.username}} </strong>
            <small class="card-subtitle text-muted">{{ new Date(comment.updatedAt) | moment("Do MMMM YYYY à HH:mm") }}</small>
          </div>
          <div class="comment-header__commentActions dropdown" v-if="(currentUser.userId === comment.UserId) || (currentUser.isAdmin)">
            <button class="btn btn-sm btn-action dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-hashpopup="true" aria-expanded="false">  
              ...
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              <button v-if="(currentUser.userId === comment.UserId)"
                type="button"
                data-toggle="modal"
                data-target="#editCommentModal"
                data-backdrop="static"
                data-keyboard="false"
                title="Modifier"
                class="dropdown-item btn btn-sm btn-action btn-left fas fa-edit"
                @click="getCommentToEdit"
                :data-postid="comment.PostId" 
                :data-userid="comment.UserId"
                :data-commentid="comment.id">
                Modifier
              </button>
              <button v-if="(currentUser.userId === comment.UserId) || (currentUser.isAdmin)"
                type="button"
                title="Supprimer"
                class="dropdown-item btn btn-sm btn-delete btn-right fas fa-trash-alt"
                @click="deleteComment"
                :data-postid="comment.PostId" 
                :data-userid="comment.UserId"
                :data-commentid="comment.id">
                Supprimer
              </button>
            </div>
          </div>
        </div>
        <div v-if="comment.content !== null" class="comment-content">
          <FormatContent :brutContent="comment.content"></FormatContent>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormatContent from "@/components/FormatContent.vue";
import ModifyComment from "@/components/ModifyComment.vue";
import CommentService from '../services/comment.service';
export default {
  name: 'CommentsList',
  components: {
    FormatContent,
    ModifyComment
  },
  props: {
    commentsToShow: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      editMode: false,
      commentToEdit: ''
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    deleteComment(e) {
      const postId = e.target.dataset.postid;
      const userId = e.target.dataset.userid;
      const commentId = e.target.dataset.commentid;
      CommentService.deleteComment(postId, userId, commentId).then(
        response => {
          console.log(response.data.message);
          window.location.reload()
        },
        error => {
          console.log(error);
        }
      );
    },
    getCommentToEdit(e) {
      for (let comment of this.commentsToShow) {
        if (comment.id == e.target.dataset.commentid) {
          this.commentToEdit = comment;
          console.log(this.commentToEdit);
        }
      }
      this.editMode = true;
    },
    updateEditModeStatus(payload) {
      this.editMode = payload.editMode;
      window.location.reload();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/_variables.scss';
.comment {
  hr {
    margin: 5px 0;
  }
  background-color: white;
  box-shadow: none;
  border-radius: 0;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .dropdown-toggle {
      background-color: map-get($colors, secondary-btn-color);
      color: map-get($colors, secondary-font-color);
      &:hover {
        background-color: map-get($colors, primary-btn-color);
        color: map-get($colors, primary-font-color);
        border-color: map-get($colors, secondary-btn-color);
      }
    }
    .dropdown-menu {
      min-width: 0;
    }
    .dropdown-toggle {
      padding: 0 8px;
    }
    .dropdown-toggle::after {
      content: none;
    }
  }
  &-body {
    padding: 8px 10px;
  }
  &-content {
    p {
      margin: 0;
    }
  }
  .text-muted {
    color: black !important;
  }

  
}
</style>