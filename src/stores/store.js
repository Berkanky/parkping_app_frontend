import { defineStore, acceptHMRUpdate } from 'pinia';
import axios from 'axios';

export const UseStore = defineStore('UseStore', {
  state: () => ({
    app_version: "1.1.2",
    app_name:"parkping",
    app_domain: "app.parkping.app",
    
    user_data: {}
  }),
  actions: {
    async get_user_details() {

      var backend_url = import.meta.env.VITE_BACKEND_URL;
      var end_point = backend_url + '/user-details';

      var res = await axios.get(end_point, { withCredentials: true });
      if( res.status !== 200 ) return;

      this.user_data = res.data.user_data;
    }
  }
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(UseStore, import.meta.hot));