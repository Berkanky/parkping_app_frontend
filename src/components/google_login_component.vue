<template>
  <q-btn class="btn google-btn text-white" unelevated no-caps :loading="loading" @click="onGoogle">
    <div class="btn-inner">
      <span class="btn-icon">
        <q-icon name="fa-brands fa-google" size="xs"></q-icon>
      </span>
      <span class="btn-text">Continue with Google</span>
    </div>
  </q-btn>
</template>

<script>
import { UseStore } from '../stores/store';
import { load_gsi } from 'boot/gsi';

export default {
  name: "GoogleLoginComponent",
  setup() {
    var store = UseStore();
    return { store }
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
  async mounted() {
    await this.initGoogleOnce();
  },
  methods: {
    async ensureGsiReady() {
      if (window.google?.accounts?.id) return true;
      try {
        await load_gsi();
        return !!window.google?.accounts?.id;
      } catch (e) {
        console.error("GSI load failed", e);
        return false;
      }
    },
    async initGoogleOnce() {
      if (this.initialized) return true;

      var ok = await this.ensureGsiReady();
      if (!ok) return false;
      if (!this.GOOGLE_CLIENT_ID) return false;

      window.google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: (resp) => this.handleCredentialResponse(resp),
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
      });

      this.initialized = true;
      return true;
    },
    async onGoogle() {
      this.loading = true;
      try {
        var ok = await this.initGoogleOnce();
        if (!ok) return;

        window.google.accounts.id.prompt((n) => {
          if (n.isNotDisplayed()) console.error("GSI not displayed:", n.getNotDisplayedReason());
          if (n.isSkippedMoment()) console.error("GSI skipped:", n.getSkippedReason());
          if (n.isDismissedMoment()) console.error("GSI dismissed:", n.getDismissedReason());
        });
      } finally {
        this.loading = false;
      }
    },
    async google_verify_service(id_token) {
      try {
        var response = await this.$api.post('/auth/google', { id_token });
        return response.status === 200;
      } catch (e) {
        return false;
      }
    },
    async handleCredentialResponse(response) {
      var idToken = response?.credential;
      if (!idToken) return;

      this.loading = true;

      try {
        var ok = await this.google_verify_service(idToken);
        if (!ok) throw new Error("Google verify failed");

        this.$router.push({ name: "home" });
      } catch (err) {
        console.error(err);
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