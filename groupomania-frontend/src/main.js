import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidate from 'vee-validate';
import moment from 'moment';
require('moment/locale/fr');

Vue.config.productionTip = false

Vue.use(require('vue-moment'), {
  moment
});
Vue.use(VeeValidate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
