<template>
  <div id="newComment" class="card comment-card">
    <form @submit.prevent="createComment" class="card-body">
      <div class="form-group">
        <label for="newCommentContent" class="sr-only">Description</label>
        <textarea
          v-model="comment.content"
          class="form-control"
          placeholder="Ecrivez ici votre commentaire..."
          name="newCommentContent"
          id="newCommentContent"
          rows=3
          required
        ></textarea>
        <div
          v-if="errors.has('newCommentContent')"
          class="alert alert-danger"
          role="alert"
        >Comment is required!</div>
      </div>
      <div class="form-group">
        <button type="button" @click="hideCreateCommentElt" class="btn btn-cancel">Annuler</button>
        <button type="submit" class="btn btn-action">Valider</button>
      </div>
    </form>
  </div>
</template>

<script>
import CommentService from '../services/comment.service';
export default {
  name: 'NewComment',
  props: {
    postToComment: {
      required: true
    }
  },
  data() {
    return {
      comment: {
        content: null,
      }
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    hideCreateCommentElt() {
      this.$emit('comment-mode-status', {
        commentMode: false
      })
    },
    createComment() {
      CommentService.createComment(this.postToComment, this.comment, this.currentUser).then(
        response => {
          console.log(response.data.message);
          this.hideCreateCommentElt();
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/_variables.scss';
#newComment {
  background-color: map-get($colors, secondary-bg-color);
  box-shadow: none;
  border-radius: 0;
  .comment-card {
    margin: 0 0 0.8rem 0;
  }
  .card-body {
    padding: 10px 10px 0 10px;
  }
}
</style>