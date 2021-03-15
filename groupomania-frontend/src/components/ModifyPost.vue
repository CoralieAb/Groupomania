<template>
  <div class="modal fade" id="editPostModal" tabindex="-1" role="dialog" aria-labelledby="editPostModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="exampleModalLabel">Modifier la publication</h2>
          <button type="button" @click="hideModal" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="form-group">
              <label for="postContent" class="sr-only">Description</label>
              <textarea
                v-model="post.content"
                class="form-control"
                placeholder="Que voulez-vous dire?"
                name="postContent"
                id="postContent"
                rows=4
              ></textarea>
            </div>
            <div v-if="post.oldAttachment == null" class="form-group">
              <label for="editedPostFile">Ajoutez une image</label>
              <input
                type="file"
                class="form-control-file"
                name="editedPostFile"
                id="editedPostFile"
                accept="image/jpg, image/jpeg, image/png, image/gif"
                @change="onNewFileSelected"
              />
            </div>
          </form>
          <div v-if="post.oldAttachment != null" class="oldAttachmentPreview">
            <button type="button" @click="deleteOldAttachment" class="close" aria-label="deleteOldAttachment">
              <span aria-hidden="true">&times;</span>
            </button>
            <img :src="post.oldAttachment" class="card-img-bottom" alt=""/>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="hideModal" class="btn btn-cancel" data-dismiss="modal">Annuler</button>
          <button type="submit" @click="modifyPost" class="btn btn-action">Sauvegarder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostService from '../services/post.service';
export default {
  name: 'ModifyPost',
  props: {
    postToEdit: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      post: {
        id: this.postToEdit.id,
        content: this.postToEdit.content,
        oldAttachment: this.postToEdit.attachment,
        userId: this.postToEdit.UserId,
        newAttachment: ""
      },
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    onNewFileSelected(e) {
      this.post.newAttachment = e.target.files[0];
    },
    deleteOldAttachment() {
      this.post.oldAttachment = null;
    },
    hideModal() {
      this.$emit('edit-mode-status', {
        editMode: false
      });
      console.log(this.post);
      console.log(this.postToEdit);
    },
    modifyPost() {
      console.log(this.post);
      PostService.modifyPost(this.post, this.currentUser).then(
        response => {
          console.log(response.data.message);
          this.hideModal();
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