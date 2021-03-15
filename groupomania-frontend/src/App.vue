<template>
  <div id="app">
    <nav class="navbar navbar-expand-sm navbar-custom">
      <a href class="navbar-brand">
        <img class="img-fluid" src="./assets/icon-left-font-monochrome-white.svg" width="180px"/>
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCustom" aria-controls="navbarCustom" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fa fa-bars fa-lg py-1 text-white"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarCustom">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              <i class="fas fa-home"></i> Accueil
            </router-link>
          </li>
          <li v-if="showAdminBoard" class="nav-item">
            <router-link to="/admin" class="nav-link">Admin</router-link>
          </li>
        </ul>
        <ul v-if="!currentUser" class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/signup" class="nav-link">
              <i class="fas fa-user-plus"></i> S'inscrire
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">
              <i class="fas fa-sign-in-alt"></i> Connexion
            </router-link>
          </li>
        </ul>
        <ul v-if="currentUser" class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/profile" class="nav-link" title="Informations utilisateur">
              <i class="fas fa-user"></i> {{currentUser.username}}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/wall" class="nav-link">
              <i class="fas fa-globe-americas"></i> Mur
            </router-link>
          </li>
          <li class="nav-item">
            <a href class="nav-link signout" title="Déconnexion" @click.prevent="logOut">
              <i class="fas fa-power-off"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <main class="container">
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.isAdmin) {
        return true
      }
      return false;
    }
  },
  methods: {
    logOut() {
      this.$router.push('/login');
      this.$store.dispatch('auth/logout');
    }
  }
};
</script>

<style lang="scss">
@import './scss/_variables.scss';
body {
  overflow: auto;
  background-color: #F1F1F1;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: map-get($colors, primary-font-color);
  margin: auto;
  .container {
    padding: 10px;
  }
  h1 {
    text-align: center;
    font-size: map-get($size, h1-font-size);
  }
  h2 {
    font-size: map-get($size, h2-font-size);
  }
  h3 {
    font-size: map-get($size, h3-font-size)
  }
}
nav {
  a {
    font-weight: bold;
    color: map-get($colors, secondary-font-lighter-color);
    transition: 0.5s;
    &.router-link-exact-active {
      color: map-get($colors, secondary-font-color);
    }
    &:hover {
      color: map-get($colors, third-font-color);
      transition-timing-function: ease;
    }
  }
  &__disconnected {
    a {
      font-weight: bold;
      color: map-get($colors, secondary-font-lighter-color);
      &.router-link-exact-active {
        color: map-get($colors, secondary-font-color);
      }
      &:hover {
        color: map-get($colors, third-font-color);
      }
    }
  }
}
.navbar {
  &-custom {
    background-color: map-get($colors, primary-bg-color);
  }
  &-brand {
    color: map-get($colors, secondary-font-color);
    &:hover {
      color: map-get($colors, secondary-font-color);
    }
  }
  .signout {
    text-align: center;
    color: map-get($colors, third-font-color);
    border-radius: 10px;
    &:hover {
      background-color: map-get($colors, third-font-color);
      color: map-get($colors, secondary-font-color);
    }
  }
}

.btn {
  font-weight: bold;
  background-color: map-get($colors, primary-btn-color);
  color: map-get($colors, primary-font-color);
  transition: 0.5s;
  &:hover {
    transition-timing-function: ease;
  }
  &-delete:hover {
    background-color: map-get($colors, btn-hover-delete-color);
    color: map-get($colors, secondary-font-color);
  }
  &-cancel:hover {
    background-color: map-get($colors, btn-hover-cancel-color);
    color: map-get($colors, secondary-font-color);
  }
  &-action:hover {
    background-color: map-get($colors, btn-hover-action-color);
    color: map-get($colors, secondary-font-color);
  }
  &-reaction:hover {
    background-color: map-get($colors, btn-hover-reaction-color);
    color: map-get($colors, secondary-font-color);
  }
}
.card {
  background-color: map-get($colors, primary-bg-color);
  font-size: map-get($size, font-size);
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 10px;
  border-color: #D8D8D8;
  margin: auto;
  -moz-box-shadow: 0 0 10px 1px #D8D8D8;
  -webkit-box-shadow: 0 0 10px 1px #D8D8D8;
  box-shadow: 0 0 10px 1px #D8D8D8;
}
</style>
