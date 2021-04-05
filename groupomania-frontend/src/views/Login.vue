<template>
  <div class="login">
    <div class="card">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            v-model="user.email"
            v-validate="'required|email'"
            type="email"
            class="form-control"
            name="email"
            id="email"
          />
          <div
            v-if="errors.has('email')"
            class="alert alert-danger"
            role="alert"
          >{{errors.first('email')}}</div>
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            v-model="user.password"
            v-validate="'required'"
            type="password"
            class="form-control"
            name="password"
            id="password"
          />
          <div
            v-if="errors.has('password')"
            class="alert alert-danger"
            role="alert"
          >Password is required!</div>
        </div>
        <div class="form-group">
          <button class="btn btn-action btn-block" :disabled="loading">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Se connecter</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import User from '../models/user';
export default {
  name: 'Login',
  data() {
    return {
      user: new User('',''),
      loading: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/wall');
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }
        if (this.user.email && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/wall');
            },
            error => {
              this.loading = false;
              this.message = error.response.data.error || error.message;
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
.login {
  margin-top: 30px;
}

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