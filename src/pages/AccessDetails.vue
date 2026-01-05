<template>
  <q-page class="pp-page">
    <div class="vd-topbar">
      <q-btn flat round dense icon="chevron_left" class="vd-icon" v-on:click="go_back()" />
    </div>
    <div class="vd-content">
      <q-card v-if="current_access_state === 'ready'" class="active-card" flat>
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
                  <button class="pp-act" type="button" @click="download_pdf" v-close-popup>
                    <span class="pp-act-ic">
                      <q-icon name="picture_as_pdf" size="18px" />
                    </span>
                    <span class="pp-act-txt">
                      <span class="pp-act-title">Download PDF</span>
                      <span class="pp-act-sub">Save your QR as a file</span>
                    </span>
                  </button>
                  <div class="pp-act-divider" />
                  <button class="pp-act pp-act-danger" type="button" @click="disable_access" v-close-popup>
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
            <div class="code-text">{{ active_access_detail?.public_code }}</div>
            <q-btn round dense flat icon="content_copy" class="copy-btn"
              @click="copy_code(active_access_detail?.public_code)" :disable="!active_access_detail?.public_code" />
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
                <div class="stat-val">{{ active_access_detail?.use_count }}</div>
              </div>
            </div>
            <div class="stat">
              <div class="stat-ic"><q-icon name="history" size="16px" /></div>
              <div class="stat-meta">
                <div class="stat-label">LAST USED</div>
                <div class="stat-val">{{ active_access_detail?.last_used_date }}</div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
      <q-card v-else-if="current_access_state === 'loading'" class="active-card" flat>
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
      <q-card v-else-if="current_access_state === 'empty'" class="active-card" flat>
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
          </div>
          <div class="empty-state q-mt-md">
            <div class="empty-ic">
              <q-icon name="qr_code_2" size="22px" />
            </div>
            <div class="empty-title">No active access</div>
            <div class="empty-desc">Create a public code to share your profile via QR.</div>

            <q-btn unelevated no-caps class="empty-cta q-mt-md" icon="add" label="Create access" @click="on_add" />
          </div>
        </div>
      </q-card>
      <q-card v-else class="active-card" flat>
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
          </div>
          <div class="empty-state q-mt-md">
            <div class="empty-ic empty-ic-warn">
              <q-icon name="wifi_off" size="22px" />
            </div>
            <div class="empty-title">Could not load</div>
            <div class="empty-desc">Try again. If it keeps happening, the API is having a bad day.</div>
            <q-btn unelevated no-caps class="empty-cta q-mt-md" icon="refresh" label="Retry" @click="this.on_add();" />
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
                <div class="revoked-code">{{ row.public_code }}</div>
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
    </div>
  </q-page>
</template>

<script>
import { copyToClipboard } from "quasar";
import notify from "src/utils/notify";
import { UseStore } from "../stores/store";

export default {
  setup() {
    var store = UseStore();
    return {
      store
    }
  },
  data() {
    return {
      store: null,
      current_user_id: null,
      active_access_detail: null,
      revoked_profile_access_details: [],
      current_access_state: "loading"
    };
  },
  async mounted() {

    var { user_id } = this.$route.params;
    this.current_user_id = user_id;

    await this.get_current_access_details();
    await this.get_revoked_access_details();
  },
  methods: {
    go_back(){
      this.$router.back();
    },
    async download_pdf() {
      try {

        var res = await this.$api.get("/access-token-download", {
          responseType: "blob"
        });

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
    async disable_access() {
      var res = await this.$api.put("/delete-access-token");
      if (res.status !== 200) return;

      await this.get_current_access_details();
      await this.get_revoked_access_details();
    },
    async get_current_access_details() {
      this.current_access_state = 'loading';
      this.active_access_detail = null;

      var res = await this.$api.get("/my-access-tokens");
      if (res.status === 200) {
        this.active_access_detail = res?.data?.access_token_details || null;
        this.current_access_state = 'ready';
      } else {
        this.current_access_state = null;
      }
    },
    async get_revoked_access_details() {
      var res = await this.$api.get("/revoked-access-tokens");
      if (res.status !== 200) return;

      this.revoked_profile_access_details = res.data?.revoked_profile_access_tokens || [];
    },
    async copy_code(code) {
      if (!code) return;

      await copyToClipboard(String(code));
    },
    async on_add() {
      var res = await this.$api.post("/update-access-token");
      if (res.status !== 200) return;

      await this.get_current_access_details();
    }
  }
};
</script>

<style scoped>
.pp-page {
  min-height: 100%;
  background: #1c1c22;
  color: #ffffff;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-label {
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #a9a9b6;
  font-weight: 700;
}

.active-card,
.revoked-card {
  border-radius: 20px;
  background: #24242b;
  border: 1px solid #2f2f38;
  box-shadow: none;
  position: relative;
  overflow: hidden;
}

.active-card::before {
  display: none;
}

.active-card-inner {
  padding: 18px 16px 14px;
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

.head-sub {
  font-size: 13px;
  color: #ffffff;
  opacity: 0.9;
  font-weight: 700;
}

.more-btn {
  color: #ffffff;
  opacity: 0.85;
}

.qr-wrap {
  display: flex;
  justify-content: center;
}

.qr-frame {
  width: 220px;
  height: 220px;
  border-radius: 22px;
  background: #1f1f25;
  border: 1px solid #2f2f38;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-img {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #24242b;
}

.qr-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #2a2a33;
}

.code-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 12px 12px 16px;
  border-radius: 16px;
  background: #1f1f25;
  border: 1px solid #2f2f38;
}

.code-text {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 1.8px;
  color: #ffffff;
}

.copy-btn {
  background: #2a2a33;
  border: 1px solid #2f2f38;
  color: #ffffff;
}

.copy-btn:active {
  transform: scale(0.98);
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
  border-top: 1px solid #2f2f38;
  padding-top: 12px;
}

.stat-ic {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #2a2a33;
  border: 1px solid #2f2f38;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  opacity: 0.85;
}

.stat-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-label {
  font-size: 10px;
  letter-spacing: 1px;
  color: #a9a9b6;
  font-weight: 800;
}

.stat-val {
  margin-top: 2px;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  opacity: 0.9;
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
  background: #1f1f25;
  border: 1px solid #2f2f38;
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
  background: #2a2a33;
  border: 1px solid #2f2f38;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  opacity: 0.85;
}

.revoked-texts {
  min-width: 0;
}

.revoked-code {
  font-weight: 900;
  letter-spacing: 1px;
  font-size: 14px;
  color: #ffffff;
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
  color: #a9a9b6;
}

.sub-ic {
  opacity: 0.8;
}

.revoked-badge {
  background: transparent;
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
  padding: 6px 10px;
  font-weight: 900;
  letter-spacing: 0.6px;
}

.empty {
  padding: 14px 6px 6px 6px;
  color: #a9a9b6;
  font-weight: 700;
  font-size: 12px;
}

.empty-state {
  margin-top: 10px;
  padding: 16px 14px;
  border-radius: 18px;
  background: #1f1f25;
  border: 1px solid #2f2f38;
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
  background: #2a2a33;
  border: 1px solid #2f2f38;
  color: #ffffff;
}

.empty-ic-warn {
  background: #2a2a33;
  border-color: #2f2f38;
  color: #ffffff;
}

.empty-title {
  font-weight: 900;
  font-size: 14px;
  color: #ffffff;
}

.empty-desc {
  margin-top: 6px;
  font-weight: 700;
  font-size: 12px;
  color: #a9a9b6;
}

.empty-cta {
  border-radius: 14px;
  background: #2a2a33;
  border: 1px solid #2f2f38;
  color: #ffffff;
  box-shadow: none;
}

.vd-content {
  padding: 10px 14px 18px 14px;
}

.vd-topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    background: rgba(28, 28, 34, 0.92);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.vd-title {
    flex: 1;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.2px;
}

.vd-icon {
    color: #ffffff;
    opacity: 0.92;
}

.vd-ok {
    color: #2eff7b;
}

.vd-ok:deep(.q-btn) {
    padding: 0;
}

.vd-ok:deep(.q-btn__content) {
    width: 34px;
    height: 26px;
    border-radius: 10px;
    background: rgba(46, 255, 123, 0.12);
    border: 1px solid rgba(46, 255, 123, 0.28);
    display: grid;
    place-items: center;
}
</style>

<style>
.pp-actions-menu {
  border-radius: 18px !important;
  padding: 0 !important;
  overflow: hidden !important;

  background: #24242b !important;
  border: 1px solid #2f2f38 !important;
  box-shadow: none !important;

  color: #ffffff !important;
}

.pp-actions-menu .q-focus-helper {
  display: none !important;
}

.pp-actions-menu .pp-actions {
  min-width: 270px !important;
  padding: 10px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
}

.pp-actions-menu .pp-act {
  all: unset !important;
  box-sizing: border-box !important;

  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;

  border-radius: 14px !important;
  padding: 12px 12px !important;

  background: #1f1f25 !important;
  border: 1px solid #2f2f38 !important;

  cursor: pointer !important;
  -webkit-tap-highlight-color: transparent !important;
}

.pp-actions-menu .pp-act:hover {
  background: #2a2a33 !important;
}

.pp-actions-menu .pp-act:active {
  transform: scale(0.99) !important;
}

.pp-actions-menu .pp-act-ic {
  width: 38px !important;
  height: 38px !important;
  border-radius: 14px !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  background: #2a2a33 !important;
  border: 1px solid #2f2f38 !important;
  color: #ffffff !important;

  flex: 0 0 auto !important;
}

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
  letter-spacing: 0.2px !important;
  color: #ffffff !important;

  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.pp-actions-menu .pp-act-sub {
  display: block !important;
  font-weight: 700 !important;
  font-size: 11px !important;
  color: #a9a9b6 !important;

  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.pp-actions-menu .pp-act-divider {
  height: 1px !important;
  margin: 0 8px !important;
  background: #2f2f38 !important;
}

.pp-actions-menu .pp-act-danger:hover {
  background: #2a2a33 !important;
  border-color: #ff4d4d !important;
}

.pp-actions-menu .pp-act-ic-danger {
  background: #2a2a33 !important;
  border-color: #ff4d4d !important;
  color: #ff4d4d !important;
}
</style>