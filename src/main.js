import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import 'bootstrap/dist/css/bootstrap.min.css';
// import b-table
import BootstrapVue from "bootstrap-vue";

// import JQuery(for Bootstrap etc)
import jQuery from "jquery";
global.jquery = jQuery;
global.$ = jQuery;
window.$ = window.jQuery = require("jquery");

Vue.config.productionTip = false
Vue.config.silent = false;
Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
