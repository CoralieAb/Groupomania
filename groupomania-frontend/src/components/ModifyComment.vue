<template>
  <div class="modal fade" id="editCommentModal" tabindex="-1" role="dialog" aria-labelledby="editCommentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="exampleModalLabel">Modifier votre commentaire</h2>
          <button type="button" @click="hideModal" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="form-group">
              <label for="commentContent" class="sr-only">Description</label>
              <textarea
                v-model="comment.content"
                class="form-control"
                placeholder="Que voulez-vous dire?"
                name="commentContent"
                id="commentContent"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" @click="hideModal" class="btn btn-sm btn-cancel" data-dismiss="modal">Annuler</button>
          <button :disabled="(comment.content == null) || (comment.content == '')" type="submit" @click="modifyComment" class="btn btn-sm btn-action">Sauvegarder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commentService from '../services/comment.service';
export default {
  name: 'ModifyComment',
  props: {
    commentToEdit: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comment: {
        id: this.commentToEdit.id,
        content: this.commentToEdit.content,
        postId: this.commentToEdit.PostId,
        userId: this.commentToEdit.UserId
      }
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    hideModal() {
      this.$emit('edit-mode-status', {
        editMode: false
      });
    },
    modifyComment() {
      console.log(this.comment);
      commentService.modifyComment(this.comment).then(
        response => {
          console.log(response.data.message);
          this.hideModal();
        },
        error => {
          console.log(error);
        }
      )

    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/_variables.scss';
.modal {
  &-header {
    background-color: map-get($colors, primary-bg-color);
    color: map-get($colors, secondary-font-color);
    .close {
      color: map-get($colors, secondary-font-color);
      &:hover {
        color: map-get($colors, secondary-font-color);
      }
    }
  }
  &-footer {
    background-color: map-get($colors, primary-bg-color);
    color: map-get($colors, secondary-font-color);
  }
}
</style>