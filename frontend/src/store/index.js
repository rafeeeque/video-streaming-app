import { createStore } from 'vuex';

const store = createStore({
  state: {
    isLoading: false,
    loadingText: "Loading...",
  },
  mutations: {
    setLoading(state, payload) {
        state.isLoading = payload.isLoading;
        state.loadingText = payload.loadingText || "Loading...";
    }
  },
  actions: {
    startLoading({ commit }, loadingText) {
        commit("setLoading", { isLoading: true, loadingText });
    },
    stopLoading({ commit }) {
        setTimeout(() => {
            commit("setLoading", { isLoading: false });
        }, 1000);
    },
  },
  getters: {
    isLoading: (state) => state.isLoading,
    loadingText: (state) => state.loadingText,
  }
});

export default store;
