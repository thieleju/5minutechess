import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  plugins: [createPersistedState()],
});

export default store;
