<template>
  <div id="newPost" class="card">
    <form @submit.prevent="createPost" class="card-body">
      <div class="form-group">
        <label for="newPostContent" class="sr-only">Description</label>
        <textarea
          v-model="post.content"
          class="form-control"
          placeholder="Que voulez-vous dire?"
          name="newPostContent"
          id="newPostContent"
          rows=4
        ></textarea>
        <div
          v-if="errors.has('newPostContent')"
          class="alert alert-danger"
          role="alert"
        >Description is required!</div>
      </div>
      <div class="form-group">
        <label for="postFile">Ajoutez une image</label>
        <input
          type="file"
          class="form-control-file"
          name="postFile"
          id="postFile"
          accept="image/jpg, image/jpeg, image/png, image/gif"
          @change="onFileSelected"
        />
        <div
          v-if="errors.has('postFile')"
          class="alert alert-danger"
          role="alert"
        >Picture is required!</div>
      </div>
      <div class="form-group">
        <button :disabled="((post.content == null) || (post.content == '')) && (post.attachment == null)" type="submit" class="btn btn-action btn-block">Publier</button>
      </div>
    </form>
  </div>
</template>

<script>
import PostService from '../services/post.service';
export default {
  name: 'NewPost',
  data() {
    return {
      post: {
        content: null,
        attachment: null,
      },
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    onFileSelected(e) {
      this.post.attachment = e.target.files[0];
    },
    createPost() {
      PostService.createPost(this.post, this.currentUser).then(
        response => {
          console.log(response.data.message);
          window.location.reload()
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
#newPost {
  background-color: map-get($colors, secondary-bg-color);
  .card-body {
    padding: 10px 10px 0 10px;
  }
}
</style>