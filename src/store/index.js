import login from "@/store/modules/login";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const plugins = [
  createPersistedState({
    paths: ["login"],
    storage: window.sessionStorage
  })
];

export default new Vuex.Store({
  modules: {
    login
  },
  plugins
});
