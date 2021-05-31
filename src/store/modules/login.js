const getDefaultState = () => {
  return {
    accessToken: "",
    refreshToken: "",
    memberId: "",
    authority: "",
  };
};

// initial state
const state = getDefaultState();

const getters = {
  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken,
  memberId: state => state.memberId,
  authority: state => state.authority
};

const actions = {
  async login({ commit }, { accessToken, refreshToken, memberId, authority }) {
    commit("login", { accessToken, refreshToken, memberId, authority });
  },
  async initData({ commit }) {
    commit("initData");
  }
};

// mutations
const mutations = {
  login(state, { accessToken, refreshToken, memberId, authority }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    state.memberId = memberId;
    state.authority = authority;
  },
  initData(state) {
    state.accessToken = "";
    state.refreshToken = "";
    state.memberId = "";
    state.authority = "";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
