// =========================================================
// * Vue Material Dashboard PRO - v1.4.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from "vue";
import VueRouter from "vue-router";
import DashboardPlugin from "./material-dashboard";

// Plugins
import App from "./App.vue";
import Chartist from "chartist";

// router setup
import routes from "./routes/routes";
import LoadScript from "vue-plugin-load-script";

import store from "@/store";
// plugin setup
Vue.use(VueRouter);
Vue.use(DashboardPlugin);
Vue.use(LoadScript);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
  linkExactActiveClass: "nav-item active"
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err;
  });
};

// global library setup
Vue.prototype.$Chartist = Chartist;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  store,
  router
});
