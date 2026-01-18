import { boot } from "quasar/wrappers";
import axios from "axios";

var api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 30000
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.error(err);
    return err;
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };