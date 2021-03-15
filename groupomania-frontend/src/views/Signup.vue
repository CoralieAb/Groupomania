<template>
  <div class="signup container">
    <div class="card">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form @submit.prevent="handleSignup">
        <div v-if="!successful">
          <div class="form-group">
            <label for="username">Pseudo</label>
            <input
              v-model="user.username"
              v-validate="'required|min:3|max:20'"
              type="text"
              class="form-control"
              name="username"
              id="username"
            />
            <div
              v-if="submitted && errors.has('username')"
              class="alert-danger"
            >{{errors.first('username')}}</div>
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              v-model="user.email"
              v-validate="'required|email|max:50'"
              type="email"
              class="form-control"
              name="email"
              id="email"
            />
            <div
              v-if="submitted && errors.has('email')"
              class="alert-danger"
            >{{errors.first('email')}}</div>
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              v-model="user.password"
              v-validate="'required|min:6|max:40'"
              type="password"
              class="form-control"
              name="password"
            />
            <div
              v-if="submitted && errors.has('password')"
              class="alert-danger"
            >{{errors.first('password')}}</div>
          </div>
          <div class="form-group">
            <button class="btn btn-action btn-block">S'inscrire</button>
          </div>
        </div>
      </form>
      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >{{message}}</div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';
export default {
  name: 'Signup',
  data() {
    return {
      user: new User('','',''),
      submitted: false,
      successful: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/wall');
    }
  },
  methods: {
    handleSignup() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/signup', this.user).then(
            data => {
              console.log(data);
              this.message = data.message;
              this.successful = true;
              console.log(this.message);
            },
            error => {
              console.log(error);
              this.message = error.response.data.error || error.message;
              this.successful = false;
              console.log(this.message);
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../scss/_variables.scss';
label {
  display: block;
  margin-top: 10px;
}

.card {
  background-color: map-get($colors, secondary-bg-color);
  max-width: 350px;
  padding: 40px 40px;
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>