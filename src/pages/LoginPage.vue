<template>
  <q-page class="login-page">
    <div class="screen">
      <div class="hero">
        <q-img class="hero-img" src="../images/login_screen_image_v2.svg" fit="cover" no-spinner />
      </div>
      <div class="panel">
        <div class="panel-inner">
          <div class="brand-row">
            <img class="brand-full" src="../images/splash_screen_logo.svg" alt="ParkPing" />
          </div>

          <div class="tagline">
            parking communication made simple.<br />
            connect instantly via QR.
          </div>

          <div class="actions">
            <google_login_component />
            <guest_login_component />
            <div class="legal">
              By continuing, you agree to our Term of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import guest_login_component from 'src/components/guest_login_component.vue';
import google_login_component from 'src/components/google_login_component.vue';
export default {
  name: "LoginPage",
  components: {
    google_login_component,
    guest_login_component
  }
};
</script>

<style scoped>
.login-page {
  padding: 0;
  margin: 0;
  background:#1c1c22;
}

.screen {
  min-height: 100vh;
  width: 100%;
  background:#1c1c22;
  display: flex;
  flex-direction: column;
}

.hero {
  position: relative;
  height: 56vh;
  width: 100%;
  overflow: hidden;
  background: #0b0d10;
}

.hero-img {
  height: 56vh;
}

.panel {
  position: relative;
  flex: 1;
  background: #111317;
  overflow: hidden;
}

.panel-inner {
  position: relative;
  z-index: 2;
  padding: 26px 22px 26px;
  text-align: center;
}

.brand-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 6px;
}

.brand-full {
  height: 32px;
  width: auto;
  object-fit: contain;
  display: block;
}

.brand-text {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.3px;
}

.tagline {
  margin-top: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.45;
}

.actions {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
}

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

.legal {
  margin-top: 4px;
  max-width: 300px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.35;
}
</style>