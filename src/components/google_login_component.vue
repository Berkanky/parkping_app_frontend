<template>
  <div>
    <q-btn
      v-if="!rendered"
      label="Google ile giriş"
      color="primary"
      icon="login"
      :loading="loading"
      @click="initGoogle"
    />
    <div v-show="false" ref="googleBtn"></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GoogleLoginComponent",

  data() {
    return {
      loading: false,
      rendered: false,
    };
  },

  computed: {
    GOOGLE_CLIENT_ID() {
      return import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID;
    },
    BACKEND_URL() {
      return import.meta.env.VITE_BACKEND_URL;
    },
  },

  methods: {
    async google_verify_service(id_token) {
      var response = await axios.post(`${this.BACKEND_URL}/auth/google`, { id_token: id_token }, { withCredentials: true });
      return response.status === 200;
    },
    initGoogle() {
      if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.id
      ) {
        this.$q.notify({
          type: "negative",
          message: "Google oturum servisi yüklenemedi.",
        });
        return;
      }

      if (!this.GOOGLE_CLIENT_ID) {
        this.$q.notify({
          type: "negative",
          message: "Google Client ID tanımlı değil.",
        });
        return;
      }

      this.loading = true;

      window.google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(this.$refs.googleBtn, {
        type: "standard",
        theme: "outline",
        size: "large",
      });

      window.google.accounts.id.prompt();

      this.rendered = true;
      this.loading = false;
    },

    async handleCredentialResponse(response) {
      var idToken = response.credential;
      console.log("idToken -> " + idToken);
      if (!idToken) {
        this.$q.notify({
          type: "negative",
          message: "Google kimlik doğrulaması başarısız.",
        });
        return;
      }

      this.loading = true;

      try {
        var ok = await this.google_verify_service(idToken);

        if (ok) {

          this.$q.notify({
            type: "positive",
            message: "Giriş başarılı.",
          });

          this.$router.push({name:'home'});

        } else {
          this.$q.notify({
            type: "negative",
            message: "Giriş sırasında hata oluştu.",
          });
        }
      } catch (err) {
        console.error("google_verify_service error:", err);
        this.$q.notify({
          type: "negative",
          message:
            err?.response?.data?.message || "Giriş sırasında hata oluştu.",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
