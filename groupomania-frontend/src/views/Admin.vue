<template>
  <div class="admin">
    <header class="jumbotron" style="background:rgba(70, 101, 155, 0.2)">
      <h1>
        <strong>Administration</strong>
      </h1>
    </header>
  </div>
</template>

<script>
//import UserService from '../services/user.service';
export default {
  name: 'Admin',
  data() {
    return {
      content: ''
    };
  },
  /*mounted() {
    UserService.getAdminBoard().then(
      response => {
        this.content = response.data;
      },
      error => {
        this.content = (error.response && error.response.data) || error.message || error.toString();
      }
    );
  }*/
};
</script>