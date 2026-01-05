<template>
  <q-btn
    class="btn google-btn text-white"
    unelevated
    no-caps
    :loading="loading"
    @click="onGoogle"
  >
    <div class="btn-inner">
      <span class="btn-icon">
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303C33.654 32.658 29.199 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.964 3.036l5.657-5.657C34.047 6.053 29.232 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z" />
          <path fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 16.108 18.99 12 24 12c3.059 0 5.842 1.154 7.964 3.036l5.657-5.657C34.047 6.053 29.232 4 24 4c-7.682 0-14.36 4.33-17.694 10.691z" />
          <path fill="#4CAF50"
            d="M24 44c5.132 0 9.86-1.967 13.409-5.159l-6.19-5.238C29.19 35.091 26.715 36 24 36c-5.178 0-9.623-3.314-11.287-7.946l-6.52 5.023C9.475 39.556 16.227 44 24 44z" />
          <path fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.084 5.603l6.19 5.238C36.967 39.268 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
      </span>
      <span class="btn-text">Continue with Google</span>
    </div>
  </q-btn>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
  name: "GoogleLoginComponent",
  setup(){
    var store = UseStore();
    return{ store }
  },  
  data() {
    return {
      loading: false,
      initialized: false,
    };
  },

  computed: {
    GOOGLE_CLIENT_ID() {
      return import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID;
    }
  },
  mounted() {
    this.initGoogleOnce();
  },
  methods: {
    initGoogleOnce() {
      if (this.initialized) return;
      if (!window.google?.accounts?.id) return;
      if (!this.GOOGLE_CLIENT_ID) return;

      window.google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: (resp) => this.handleCredentialResponse(resp),
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
      });

      this.initialized = true;
    },

    onGoogle() {
      if (!this.initialized) this.initGoogleOnce();

      window.google.accounts.id.prompt((notification) => {
        if (
          notification.isNotDisplayed() ||
          notification.isSkippedMoment()
        ) return;
      });
    },

    async google_verify_service(id_token) {
      var response = await this.$api.post(
        '/auth/google',
        { id_token }
      );
      return response.status === 200;
    },

    async handleCredentialResponse(response) {
      var idToken = response?.credential;
      if (!idToken) return;

      this.loading = true;

      try {
        var ok = await this.google_verify_service(idToken);

        if (!ok) return;

        await this.store.get_user_details();

        this.$router.push({ name: "home" });
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
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

.google-btn {
  background: transparent;
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.75);
}
</style>