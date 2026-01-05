<template>
  <q-btn
    class="btn guset-btn text-white"
    unelevated
    no-caps
    :loading="this.loading"
  >
    <div class="btn-inner">
      <span class="btn-icon">
        <q-icon name="fa-solid fa-user" size="xs"></q-icon>
      </span>
      <span class="btn-text" v-on:click="login_as_guest()">Continue as Guest </span>
    </div>
  </q-btn>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
  setup(){
    var store = UseStore();
    return{ store }
  },  
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async login_as_guest(){
        this.loading = true;

        var res = await this.$api.post('/auth/guest');
        if( res.status !== 200 ) {
            this.loading = false;
            return;
        }

        await this.store.get_user_details();

        this.$router.push({ name: 'home' });
        this.loading = false;
    }
  }
};
</script>

<style scoped>
.btn {
  width: 100%;
  max-width: 320px;
  height: 48px;
  border-radius: 999px;
}

.btn-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.guset-btn {
  background: transparent;
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.75);
}
</style>