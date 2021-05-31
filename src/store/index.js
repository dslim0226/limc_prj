import login from "@/store/modules/login"

import createPersistedState from "vuex-persistedstate";

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
