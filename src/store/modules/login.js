const getDefaultState = () => {
  return {
    accessToken: "d",
    refreshToken: "d",
    memberId: "d",
    memberRole: "CHIEF_ADMIN"
  };
};

// initial state
const state = getDefaultState();

const getters = {
  accessToken: state => state.accessToken,
  refreshToken: state => state.refreshToken,
  memberId: state => state.memberId,
  memberRole: state => state.memberRole,
  isLogin: state =>
    state.accessToken !== "" && state.memberId !== "" && state.memberRole !== ""
};

const actions = {
  async login({ commit }, { accessToken, refreshToken, memberId, memberRole }) {
    commit("login", { accessToken, refreshToken, memberId, memberRole });
  },
  async initData({ commit }) {
    commit("initData");
  }
};

// mutations
const mutations = {
  login(state, { accessToken, refreshToken, memberId, memberRole }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    state.memberId = memberId;
    state.memberRole = memberRole;
  },
  initData(state) {
    state.accessToken = "";
    state.refreshToken = "";
    state.memberId = "";
    state.memberRole = "";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
