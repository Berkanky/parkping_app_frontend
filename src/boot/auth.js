import { boot } from "quasar/wrappers";
import axios from "axios";

export default boot(({ router }) => {
  router.beforeEach(async (to, from, next) => {
    if ( !to.meta.requires_auth ) return next();

    try {
      var QUASAR_PUBLIC_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      var res = await axios.get(QUASAR_PUBLIC_BACKEND_URL + "/auth/session", { withCredentials: true });

      console.log("auth_session_status -> " + res.status);
      console.log("auth_session_response -> " + JSON.stringify(res));

      if (res.status === 200) return next();
      else return next("/login");
      
    } catch (err) {
      console.log("auth_session_response -> " + JSON.stringify(err));
      return next("/login");
    }
  });
});