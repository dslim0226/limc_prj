const getDefaultState = () => {
  return {
    userId: "",
    userLevel: ""
  };
};

// initial state
const state = getDefaultState();

const getters = {
  userId: state => state.userId,
  userLevel: state => state.userLevel,
  isLogin: state =>
    state.userId !== "" && state.userLevel !== ""
};

const actions = {
  async memberInfo({ commit }, { user_id, user_level }) {
    commit("login", { userId: user_id, userLevel: user_level });
  },
  async initData({ commit }) {
    commit("initData");
  }
};

// mutations
const mutations = {
  login(state, { userId, userLevel }) {
    state.userId = userId;
    state.userLevel = userLevel;
  },
  initData(state) {
    state.userId = "";
    state.userLevel = "";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
