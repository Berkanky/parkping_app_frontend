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

      if( to?.meta?.is_avaliable_for_temporary_users === false ){
        if( res.data.temporary === true ) return next('/login');
      }

      return next();
    } catch (err) {
      return next("/login");
    }
  });
});