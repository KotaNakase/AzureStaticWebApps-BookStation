import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
// import b-table
import BootstrapVue from "bootstrap-vue";

// import fortawesome(for https://startbootstrap.com/ template this is licenced by MIT)
import "@fortawesome/fontawesome-free/css/all.min.css";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "../public/css/sb-admin.min.css";

// import JQuery(for Bootstrap etc)
import jQuery from "jquery";
global.jquery = jQuery;
global.$ = jQuery;
window.$ = window.jQuery = require("jquery");

Vue.config.productionTip = false;
Vue.config.silent = false;
Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
