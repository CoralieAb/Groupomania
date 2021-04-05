<template>
  <div class="profile">
    <header class="jumbotron" style="background:rgba(70, 101, 155, 0.2)">
      <h1>
        Profil de <strong>{{user.username}}</strong>
      </h1>
    </header>
    <p>
      <strong>Id:</strong> 
      {{user.userId}}
    </p>
    <p>
      <strong>Email:</strong> 
      {{user.email}}
    </p>
    <p v-if="user.isAdmin">
      <strong>Rôle:</strong> 
      Admin
    </p>
    <button
      type="button"
      class="btn btn-delete"
      @click="deleteAccount"
      :data-userid="user.userId">
      Supprimer mon compte
    </button>
  </div>
</template>

<script>
import UserService from '../services/user.service';
export default {
  name: 'Profile',
  data() {
    return {
      user: '',
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    //On récupère les infos de l'utilisateur
    UserService.getUserProfile(this.currentUser.userId).then(
      response => {
        this.user = response.data
        console.log(response.data);
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
    deleteAccount(e) {
      const userId = e.target.dataset.userid;
      UserService.deleteAccount(userId).then(
        response => {
          this.$store.dispatch('auth/logout');
          this.$router.push('/unsubscribeconfirmation');
          console.log(response.data.message);
        },
        error => {
          console.log(error);
        }
      )
    }
  }
};
</script>

<style lang="scss" scoped>
.profile {
  margin: auto;
  max-width: 750px;
  padding: 5px 0;
  //background-color: #F1F1F1;
}
button {
  border-color: red;
}
</style>