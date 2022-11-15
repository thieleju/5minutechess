import { defineStore, acceptHMRUpdate } from "pinia";

// export const useUserStore = defineStore("user", {
//   state: () => {
//     return {
//       access_token: "",
//       jwt: "",
//       username: "",
//       user_github: null,
//     };
//   },
//   actions: {
//     set_access_token(token: string) {
//       this.access_token = token;
//     },
//     set_jwt(token: string) {
//       this.jwt = token;
//     },
//     set_user_github(user: any) {
//       this.user_github = user;
//       this.username = user.login;
//       console.log("set_user_github", user);
//     },
//   },
//   getters: {
//     get_username: (state) => {
//       console.log("getter called", state.username);
//       state.username;
//     },
//     get_user_github: (state) => {
//       state.user_github;
//     },
//   },
// });

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
// }
