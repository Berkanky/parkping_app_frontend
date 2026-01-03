<template>
  <q-page class="pp-page q-pa-md">
    <div class="topbar">
      <div class="topbar-spacer" />
      <!-- <div class="topbar-title">My Public Codes</div> -->
<!--       <q-btn round dense flat class="topbar-plus" icon="add" @click="onAdd" />
 -->    </div>

    <!-- <div class="section-head q-mt-md">
      <div class="section-label">CURRENT ACCESS</div>
      <div v-if="isLive" class="live-pill">
        <span class="dot" />
        <span class="live-text">Live</span>
      </div>
    </div> -->

    <!-- READY -->
    <q-card v-if="current_access_state === 'ready'" class="active-card q-mt-sm" flat>
      <div class="active-card-inner">
        <div class="active-card-head">
          <div class="head-left">
            <div class="lock-wrap">
              <q-icon name="lock" size="18px" class="lock-ic" />
            </div>
            <div class="head-txt">
              <div class="head-sub">Public Access Token</div>
            </div>
          </div>

          <q-btn round dense flat icon="more_horiz" class="more-btn" :disable="!active_access_detail?.public_code">
            <q-menu class="pp-actions-menu" content-class="pp-actions-menu" anchor="bottom right" self="top right"
              :offset="[0, 10]" transition-show="jump-down" transition-hide="jump-up">
              <div class="pp-actions">
                <button class="pp-act" type="button" @click="onDownloadPdf" v-close-popup>
                  <span class="pp-act-ic">
                    <q-icon name="picture_as_pdf" size="18px" />
                  </span>
                  <span class="pp-act-txt">
                    <span class="pp-act-title">Download PDF</span>
                    <span class="pp-act-sub">Save your QR as a file</span>
                  </span>
                </button>

                <div class="pp-act-divider" />

                <button class="pp-act pp-act-danger" type="button" @click="onDisableAccess" v-close-popup>
                  <span class="pp-act-ic pp-act-ic-danger">
                    <q-icon name="block" size="18px" />
                  </span>
                  <span class="pp-act-txt">
                    <span class="pp-act-title">Disable access</span>
                    <span class="pp-act-sub">Revoke current public code</span>
                  </span>
                </button>
              </div>
            </q-menu>
          </q-btn>
        </div>

        <div class="qr-wrap q-mt-md">
          <div class="qr-frame">
            <q-img v-if="active_access_detail && active_access_detail.qr_data" :src="active_access_detail.qr_data"
              fit="contain" class="qr-img" no-spinner />
            <div v-else class="qr-skeleton" />
          </div>
        </div>

        <div class="code-pill q-mt-md">
          <div class="code-text">{{ formattedPublicCode(active_access_detail?.public_code) }}</div>
          <q-btn round dense flat icon="content_copy" class="copy-btn"
            @click="copyCode(active_access_detail?.public_code)" :disable="!active_access_detail?.public_code" />
        </div>

        <div class="stats-row q-mt-md">
          <div class="stat">
            <div class="stat-ic"><q-icon name="calendar_today" size="16px" /></div>
            <div class="stat-meta">
              <div class="stat-label">CREATED</div>
              <div class="stat-val">{{ active_access_detail?.created_date || "-" }}</div>
            </div>
          </div>

          <div class="stat">
            <div class="stat-ic"><q-icon name="qr_code_2" size="16px" /></div>
            <div class="stat-meta">
              <div class="stat-label">SCANS</div>
              <div class="stat-val">{{ safeNum(active_access_detail?.use_count) }}</div>
            </div>
          </div>

          <div class="stat">
            <div class="stat-ic"><q-icon name="history" size="16px" /></div>
            <div class="stat-meta">
              <div class="stat-label">LAST USED</div>
              <div class="stat-val">{{ lastUsedText(active_access_detail?.last_used_date) }}</div>
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- LOADING -->
    <q-card v-else-if="current_access_state === 'loading'" class="active-card q-mt-sm" flat>
      <div class="active-card-inner">
        <div class="active-card-head">
          <div class="head-left">
            <div class="lock-wrap">
              <q-icon name="lock" size="18px" class="lock-ic" />
            </div>
            <div class="head-txt">
              <div class="head-sub">Public Access Token</div>
            </div>
          </div>
          <q-btn round dense flat icon="more_horiz" class="more-btn" disable />
        </div>

        <div class="qr-wrap q-mt-md">
          <div class="qr-frame">
            <div class="qr-skeleton" />
          </div>
        </div>

        <div class="code-pill q-mt-md">
          <div class="code-text">---- ----</div>
          <q-btn round dense flat icon="content_copy" class="copy-btn" disable />
        </div>

        <div class="stats-row q-mt-md">
          <div class="stat">
            <div class="stat-ic"><q-icon name="calendar_today" size="16px" /></div>
            <div class="stat-meta">
              <div class="stat-label">CREATED</div>
              <div class="stat-val">-</div>
            </div>
          </div>
          <div class="stat">
            <div class="stat-ic"><q-icon name="qr_code_2" size="16px" /></div>
            <div class="stat-meta">
              <div class="stat-label">SCANS</div>
              <div class="stat-val">-</div>
            </div>
          </div>
          <div class="stat">
            <div class="stat-ic"><q-icon name="history" size="16px" /></div>
            <div class="stat-meta">
              <div class="stat-label">LAST USED</div>
              <div class="stat-val">-</div>
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- EMPTY -->
    <q-card v-else-if="current_access_state === 'empty'" class="active-card q-mt-sm" flat>
      <div class="active-card-inner">
        <div class="active-card-head">
          <div class="head-left">
            <div class="lock-wrap">
              <q-icon name="lock" size="18px" class="lock-ic" />
            </div>
            <div class="head-txt">
              <div class="head-sub">Public Access Token</div>
            </div>
          </div>
          <q-btn round dense flat icon="more_horiz" class="more-btn" disable />
        </div>

        <div class="empty-state q-mt-md">
          <div class="empty-ic">
            <q-icon name="qr_code_2" size="22px" />
          </div>
          <div class="empty-title">No active access</div>
          <div class="empty-desc">Create a public code to share your profile via QR.</div>

          <q-btn unelevated no-caps class="empty-cta q-mt-md" icon="add" label="Create access" @click="onAdd" />
        </div>
      </div>
    </q-card>

    <!-- ERROR -->
    <q-card v-else class="active-card q-mt-sm" flat>
      <div class="active-card-inner">
        <div class="active-card-head">
          <div class="head-left">
            <div class="lock-wrap">
              <q-icon name="error_outline" size="18px" class="lock-ic" />
            </div>
            <div class="head-txt">
              <div class="head-sub">Public Access Token</div>
            </div>
          </div>
          <q-btn round dense flat icon="refresh" class="more-btn" @click="get_current_access_details" />
        </div>

        <div class="empty-state q-mt-md">
          <div class="empty-ic empty-ic-warn">
            <q-icon name="wifi_off" size="22px" />
          </div>
          <div class="empty-title">Could not load</div>
          <div class="empty-desc">Try again. If it keeps happening, the API is having a bad day.</div>

          <q-btn unelevated no-caps class="empty-cta q-mt-md" icon="refresh" label="Retry"
            @click="get_current_access_details" />
        </div>
      </div>
    </q-card>

    <div class="section-head q-mt-lg">
      <div class="section-label">REVOKED HISTORY</div>
    </div>

    <q-card class="revoked-card q-mt-sm" flat>
      <div class="revoked-inner">
        <div v-for="row in revoked_profile_access_details" :key="row._id" class="revoked-item">
          <div class="revoked-left">
            <div class="mini-qr">
              <q-icon name="qr_code_2" size="18px" />
            </div>
            <div class="revoked-texts">
              <div class="revoked-code">{{ formattedPublicCode(row.public_code) }}</div>
              <div class="revoked-sub">
                <q-icon name="event_busy" size="14px" class="sub-ic" />
                <span>Revoked - {{ row.revoked_date || "-" }}</span>
              </div>
            </div>
          </div>
          <q-badge class="revoked-badge" rounded>REVOKED</q-badge>
        </div>

        <div v-if="!revoked_profile_access_details || !revoked_profile_access_details.length" class="empty">
          No revoked tokens.
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { copyToClipboard } from "quasar";
import notify from "src/utils/notify";
import { UseStore } from "../stores/store";

export default {
  name: "MyPublicCodesPage",
  data() {
    return {
      store: null,
      current_user_id: null,
      active_access_detail: null,
      revoked_profile_access_details: [],
      current_access_state: "loading"
    };
  },
  computed: {
    isLive() {
      return this.current_access_state === "ready" && !!this.active_access_detail?.public_code;
    }
  },
  async mounted() {
    this.store = UseStore();

    var { user_id } = this.$route.params;
    if (user_id) this.current_user_id = user_id;

    await this.get_current_access_details();
    await this.get_revoked_access_details();
  },
  methods: {
    async onDownloadPdf() {
      try {
        var res = await this.$api.get("/access-token-download", {
          responseType: "blob",
          validateStatus: function () { return true; }
        });

        if (res.status !== 200) {
          try {
            var txt = await res.data.text();
            var j = JSON.parse(txt);
            if (j && j.notify && j.message) notify.error(j.message);
          } catch (e) { }
          return;
        }

        var blob = new Blob([res.data], { type: "application/pdf" });

        var cd = (res.headers && (res.headers["content-disposition"] || res.headers["Content-Disposition"])) || "";
        var name = "parkping-access.pdf";
        var m = /filename="([^"]+)"/.exec(cd);
        if (m && m[1]) name = m[1];

        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (e) {
        notify.error("Download failed");
      }
    },

    async onDisableAccess() {
      var res = await this.$api.put("/delete-access-token", null, {
        validateStatus: function () { return true; }
      });

      if (res.status !== 200) {
        if (res?.data?.notify && res?.data?.message) notify.error(res.data.message);
        return;
      }

      await this.get_current_access_details();
      await this.get_revoked_access_details();
    },

    async get_current_access_details() {
      this.current_access_state = "loading";

      var res = await this.$api.get("/my-access-tokens", {
        validateStatus: function () { return true; }
      });

      if (res.status === 200) {
        this.active_access_detail = res.data.access_token_details || null;
        this.current_access_state = this.active_access_detail ? "ready" : "empty";
        return;
      }

      if (res.status === 404) {
        this.active_access_detail = null;
        this.current_access_state = "empty";
        return;
      }

      this.active_access_detail = null;
      this.current_access_state = "error";
      if (res?.data?.notify && res?.data?.message) notify.error(res.data.message);
    },

    async get_revoked_access_details() {
      var res = await this.$api.get("/revoked-access-tokens", {
        validateStatus: function () { return true; }
      });

      if (res.status !== 200) {
        if (res?.data?.notify && res?.data?.message) notify.error(res.data.message);
        return;
      }

      this.revoked_profile_access_details = res.data.revoked_profile_access_tokens || [];
    },

    formattedPublicCode(code) {
      if (!code) return "---- ----";
      return String(code).trim().toUpperCase();
    },

    safeNum(v) {
      var n = Number(v);
      if (!Number.isFinite(n)) return 0;
      return n;
    },

    lastUsedText(v) {
      if (!v) return "-";
      return String(v);
    },

    async copyCode(code) {
      if (!code) return;
      try {
        await copyToClipboard(String(code));
        notify.success("Copied");
      } catch (e) {
        notify.error("Copy failed");
      }
    },

    async onAdd() {
      var res = await this.$api.post("/update-access-token", null, {
        validateStatus: function () { return true; }
      });

      if (res.status !== 200) {
        if (res?.data?.notify && res?.data?.message) notify.error(res.data.message);
        return;
      }

      await this.get_current_access_details();
    }
  }
};
</script>

<style scoped>
/* =========================
   <style scoped>
   ========================= */

.pp-page {
  min-height: 100%;
  background:
    radial-gradient(1200px 700px at 50% -200px, rgba(120, 170, 255, .18), transparent 55%),
    radial-gradient(900px 600px at 30% 20%, rgba(70, 120, 255, .12), transparent 55%),
    radial-gradient(900px 600px at 70% 40%, rgba(50, 255, 200, .08), transparent 55%),
    linear-gradient(180deg, #0b0f16 0%, #070a10 40%, #05070c 100%);
  color: #e9edf7;
}

.topbar {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  padding-top: 6px;
}

.topbar-title {
  text-align: center;
  font-weight: 700;
  letter-spacing: .2px;
  font-size: 18px;
  opacity: .95;
}

.topbar-plus {
  color: #8bb6ff;
  background: rgba(60, 120, 255, .18);
  border: 1px solid rgba(120, 170, 255, .25);
  box-shadow: 0 10px 30px rgba(40, 90, 200, .18);
}

.topbar-plus :deep(.q-icon) {
  opacity: .95;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-label {
  font-size: 12px;
  letter-spacing: 1.2px;
  color: rgba(233, 237, 247, .55);
  font-weight: 700;
}

.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 9999px;
  background: rgba(40, 220, 140, .10);
  border: 1px solid rgba(40, 220, 140, .20);
  color: rgba(190, 255, 230, .92);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 99px;
  background: rgba(40, 220, 140, .9);
  display: inline-block;
  box-shadow: 0 0 10px rgba(40, 220, 140, .55);
}

.live-text {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .3px;
  opacity: .95;
}

.active-card {
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(20, 34, 60, .75), rgba(12, 18, 30, .85));
  border: 1px solid rgba(120, 170, 255, .14);
  box-shadow: 0 20px 60px rgba(0, 0, 0, .45);
  position: relative;
  overflow: hidden;
}

.active-card::before {
  content: "";
  position: absolute;
  inset: -60px -40px auto -40px;
  height: 180px;
  background: radial-gradient(closest-side, rgba(120, 170, 255, .28), transparent 65%);
  filter: blur(2px);
  pointer-events: none;
}

.active-card-inner {
  padding: 18px 16px 14px;
  position: relative;
  z-index: 1;
}

.active-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lock-wrap {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: rgba(40, 120, 255, .14);
  border: 1px solid rgba(120, 170, 255, .18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-ic {
  color: rgba(150, 190, 255, .95);
}

.head-sub {
  font-size: 13px;
  color: rgba(233, 237, 247, .72);
  font-weight: 700;
}

.more-btn {
  color: rgba(233, 237, 247, .65);
}

.qr-wrap {
  display: flex;
  justify-content: center;
}

.qr-frame {
  width: 220px;
  height: 220px;
  border-radius: 22px;
  background: rgba(0, 0, 0, .30);
  border: 1px solid rgba(255, 255, 255, .06);
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-img {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: rgba(255, 255, 255, .06);
}

.qr-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(90deg, rgba(255, 255, 255, .04), rgba(255, 255, 255, .09), rgba(255, 255, 255, .04));
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 0% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

.code-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 12px 12px 16px;
  border-radius: 16px;
  background: rgba(0, 0, 0, .35);
  border: 1px solid rgba(255, 255, 255, .06);
}

.code-text {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 1.8px;
  color: rgba(233, 237, 247, .95);
}

.copy-btn {
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(255, 255, 255, .08);
  color: rgba(233, 237, 247, .72);
}

.copy-btn:active {
  transform: scale(.98);
}

.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  padding-top: 6px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, .06);
  padding-top: 12px;
}

.stat-ic {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: rgba(255, 255, 255, .04);
  border: 1px solid rgba(255, 255, 255, .06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(233, 237, 247, .65);
}

.stat-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-label {
  font-size: 10px;
  letter-spacing: 1px;
  color: rgba(233, 237, 247, .45);
  font-weight: 800;
}

.stat-val {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(233, 237, 247, .8);
}

.revoked-card {
  border-radius: 20px;
  background: rgba(10, 14, 22, .65);
  border: 1px solid rgba(255, 255, 255, .06);
  box-shadow: 0 18px 50px rgba(0, 0, 0, .38);
}

.revoked-inner {
  padding: 10px;
}

.revoked-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, .03);
  border: 1px solid rgba(255, 255, 255, .05);
}

.revoked-item+.revoked-item {
  margin-top: 10px;
}

.revoked-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.mini-qr {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, .04);
  border: 1px solid rgba(255, 255, 255, .06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(233, 237, 247, .62);
}

.revoked-texts {
  min-width: 0;
}

.revoked-code {
  font-weight: 900;
  letter-spacing: 1px;
  font-size: 14px;
  color: rgba(233, 237, 247, .92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 210px;
}

.revoked-sub {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(233, 237, 247, .55);
}

.sub-ic {
  opacity: .7;
}

.revoked-badge {
  background: rgba(255, 70, 70, .10);
  border: 1px solid rgba(255, 70, 70, .20);
  color: rgba(255, 170, 170, .92);
  padding: 6px 10px;
  font-weight: 900;
  letter-spacing: .6px;
}

.empty {
  padding: 14px 6px 6px 6px;
  color: rgba(233, 237, 247, .45);
  font-weight: 700;
  font-size: 12px;
}

.empty-state {
  margin-top: 10px;
  padding: 16px 14px;
  border-radius: 18px;
  background: rgba(0, 0, 0, .22);
  border: 1px solid rgba(255, 255, 255, .06);
  text-align: center;
}

.empty-ic {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(120, 170, 255, .10);
  border: 1px solid rgba(120, 170, 255, .14);
  color: rgba(210, 225, 255, .92);
}

.empty-ic-warn {
  background: rgba(255, 180, 70, .10);
  border-color: rgba(255, 180, 70, .18);
  color: rgba(255, 220, 180, .92);
}

.empty-title {
  font-weight: 900;
  font-size: 14px;
  color: rgba(233, 237, 247, .92);
}

.empty-desc {
  margin-top: 6px;
  font-weight: 700;
  font-size: 12px;
  color: rgba(233, 237, 247, .55);
}

.empty-cta {
  border-radius: 14px;
  background: rgba(120, 170, 255, .18);
  border: 1px solid rgba(120, 170, 255, .22);
  color: rgba(233, 237, 247, .92);
  box-shadow: 0 12px 30px rgba(40, 90, 200, .18);
}
</style>

<style>
/* QMenu teleport => GLOBAL şart */

.pp-actions-menu {
  border-radius: 18px !important;
  padding: 0 !important;
  overflow: hidden !important;

  background:
    radial-gradient(120px 120px at 20% 10%, rgba(120,170,255,.22), transparent 60%),
    radial-gradient(160px 160px at 80% 0%, rgba(50,255,200,.14), transparent 55%),
    linear-gradient(180deg, rgba(18,24,38,.92), rgba(10,14,22,.92)) !important;

  border: 1px solid rgba(255,255,255,.10) !important;
  box-shadow: 0 30px 90px rgba(0,0,0,.55), 0 0 0 1px rgba(120,170,255,.06) inset !important;

  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;

  color: rgba(233,237,247,.92) !important;
}

.pp-actions-menu .q-focus-helper { display: none !important; }

.pp-actions-menu .pp-actions {
  min-width: 270px !important;
  padding: 10px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
}

/* Button reset + layout (asıl fix burada) */
.pp-actions-menu .pp-act {
  all: unset !important;
  box-sizing: border-box !important;

  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;

  border-radius: 14px !important;
  padding: 12px 12px !important;

  background: rgba(255,255,255,.04) !important;
  border: 1px solid rgba(255,255,255,.06) !important;

  cursor: pointer !important;
  -webkit-tap-highlight-color: transparent !important;
}

.pp-actions-menu .pp-act:hover {
  background: rgba(120,170,255,.10) !important;
  border-color: rgba(120,170,255,.16) !important;
}

.pp-actions-menu .pp-act:active {
  transform: scale(.99) !important;
  background: rgba(120,170,255,.14) !important;
}

.pp-actions-menu .pp-act-ic {
  width: 38px !important;
  height: 38px !important;
  border-radius: 14px !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  background: rgba(120,170,255,.10) !important;
  border: 1px solid rgba(120,170,255,.14) !important;
  color: rgba(210,225,255,.92) !important;

  flex: 0 0 auto !important;
}

/* TEXT STACK: title üstte, sub altta */
.pp-actions-menu .pp-act-txt {
  min-width: 0 !important;
  flex: 1 1 auto !important;

  display: flex !important;
  flex-direction: column !important;
  gap: 3px !important;

  line-height: 1.15 !important;
}

.pp-actions-menu .pp-act-title {
  display: block !important;
  font-weight: 900 !important;
  font-size: 13px !important;
  letter-spacing: .2px !important;
  color: rgba(233,237,247,.94) !important;

  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.pp-actions-menu .pp-act-sub {
  display: block !important;
  font-weight: 700 !important;
  font-size: 11px !important;
  color: rgba(233,237,247,.58) !important;

  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.pp-actions-menu .pp-act-divider {
  height: 1px !important;
  margin: 0 8px !important;
  background: rgba(255,255,255,.08) !important;
}

/* Danger */
.pp-actions-menu .pp-act-danger:hover {
  background: rgba(255,70,70,.10) !important;
  border-color: rgba(255,70,70,.18) !important;
}
.pp-actions-menu .pp-act-ic-danger {
  background: rgba(255,70,70,.10) !important;
  border-color: rgba(255,70,70,.18) !important;
  color: rgba(255,190,190,.92) !important;
}
</style>