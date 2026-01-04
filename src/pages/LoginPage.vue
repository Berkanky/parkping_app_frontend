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

            <!-- <q-btn class="btn apple-btn" unelevated no-caps @click="onApple">
              <div class="btn-inner">
                <span class="btn-icon">
                  <svg width="18" height="18" viewBox="0 0 384 512" aria-hidden="true">
                    <path fill="#111317"
                      d="M318.7 268.6c-.3-37.3 16.6-65.4 52.2-87.1-19.9-28.5-50-44.1-89.7-47.2-37.6-3-78.7 22-93.7 22-15.4 0-51.8-20.9-80.2-20.9C48 135.4 0 180.1 0 271.5 0 298 4.9 325.8 14.7 354.9c13.1 37.3 60.4 128.8 109.8 127.3 26.4-.6 45-18.7 79.3-18.7 33.3 0 50.8 18.7 80 18.7 49.8-.8 92.6-84.2 105.1-121.6-68-32.1-69.9-95.9-70.2-92zM252.2 86.3C281.1 51.8 278.5 20 277.6 8.7c-26 1.5-56 17.3-73.2 37.1-19 21.4-30.2 47.9-27.8 77.4 28.2 2.2 54.2-12.8 75.6-36.9z" />
                  </svg>
                </span>
                <span class="btn-text">Continue with Apple</span>
              </div>
            </q-btn> -->

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
import google_login_component from 'src/components/google_login_component.vue';
export default {
  name: "LoginPage",
  components: {
    google_login_component
  },
  data() {
    return {
    };
  },
  methods: {
    onGoogle() { },
    onApple() { }
  }
};
</script>

<style scoped>
.login-page {
  padding: 0;
  margin: 0;
  background: #111317;
}

.screen {
  min-height: 100vh;
  width: 100%;
  background: #111317;
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

.apple-btn {
  background: #ffffff;
  color: #111317;
  border: 2px solid rgba(255, 255, 255, 0.9);
}

.legal {
  margin-top: 4px;
  max-width: 300px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.35;
}
</style>