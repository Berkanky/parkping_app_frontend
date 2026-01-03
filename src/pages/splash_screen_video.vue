<template>
  <q-page class="splash-page">
    <div class="video-wrap">
      <video
        class="splash-video"
        :src="videoSrc"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
      />
      <div class="vignette" />
      <div class="grain" />
    </div>

    <div class="content">
      <img class="splash-logo" src="../images/splash_screen_logo.svg" alt="ParkPing" />
      <div class="tagline">
        Fast communication for your vehicle.<br />
        No unnecessary noise.
      </div>
    </div>
  </q-page>
</template>

<script>
import { UseStore } from "../stores/store";

export default {
  name: "SplashScreen",
  setup() {
    const store = UseStore();
    return { store };
  },
  data() {
    return {
      timeoutId: null,
      videoSrc: new URL("../assets/splash.mp4", import.meta.url).href
    };
  },
  mounted() {
    // iOS bazen autoplay naz yapar; muted+playsinline ile genelde okay.
    // Yine de garanti olsun diye küçük bir play denemesi:
    this.$nextTick(() => {
      var v = this.$el.querySelector("video");
      if (v && v.play) {
        v.play().catch(() => {});
      }
    });

    this.timeoutId = setTimeout(() => {
      //this.$router.replace({ path: "/home" });
    }, 3500);
  },
  beforeUnmount() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
};
</script>

<style scoped>
.splash-page {
  position: relative;
  min-height: 100%;
  overflow: hidden;
  background: #070a10;
}

/* video background */
.video-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.splash-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  /* video çok parlaksa UI patlamasın */
  filter: saturate(1.05) contrast(1.05) brightness(0.85);
  transform: scale(1.02);
}

/* üstüne hafif vignette */
.vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 600px at 50% 35%, rgba(120,170,255,.10), transparent 60%),
    radial-gradient(900px 600px at 50% 70%, rgba(50,255,200,.08), transparent 65%),
    linear-gradient(180deg, rgba(5,7,12,.25) 0%, rgba(5,7,12,.55) 55%, rgba(5,7,12,.85) 100%);
}

/* çok hafif grain (isteğe bağlı) */
.grain {
  position: absolute;
  inset: 0;
  opacity: .08;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
  background-size: 160px 160px;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* content */
.content {
  position: relative;
  z-index: 2;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 24px 16px;
  text-align: center;

  animation: intro 420ms ease-out both;
}

.splash-logo {
  width: 160px;
  animation: floaty 2.8s ease-in-out infinite, glow 2.8s ease-in-out infinite;
  will-change: transform, filter;
}

.tagline {
  margin-top: 14px;
  color: rgba(233,237,247,.72);
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.92;
  text-shadow: 0 10px 30px rgba(0,0,0,.55);
}

@keyframes intro {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes floaty {
  0%   { transform: translateY(0) scale(1); }
  50%  { transform: translateY(-8px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
}

@keyframes glow {
  0%   { filter: drop-shadow(0 0 0 rgba(0,0,0,0)); opacity: .92; }
  50%  { filter: drop-shadow(0 10px 18px rgba(64,255,170,.18)); opacity: 1; }
  100% { filter: drop-shadow(0 0 0 rgba(0,0,0,0)); opacity: .92; }
}

@media (prefers-reduced-motion: reduce) {
  .splash-logo { animation: none; }
  .content { animation: none; }
}
</style>