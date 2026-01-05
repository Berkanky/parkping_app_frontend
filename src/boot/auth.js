import { boot } from "quasar/wrappers";
import axios from "axios";
export default boot(({ router }) => {
  router.beforeEach(async (to, from, next) => {
    if ( !to.meta.requires_auth ) return next();

    try {

      var backend_url = import.meta.env.VITE_BACKEND_URL;
      var end_point = backend_url + '/auth/session';

      var res = await axios.get(end_point, { withCredentials: true });
      if (res.status !== 200) return next("/login");

      return next();
    } catch (err) {
      console.log("auth_session_response -> " + JSON.stringify(err));
      return next("/login");
    }
  });
});