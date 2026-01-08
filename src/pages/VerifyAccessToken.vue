<template>
    <q-page class="pp-search-page">
        <div class="pp-topbar">
            <q-btn flat round icon="chevron_left" class="pp-back-btn" @click="go_back" />
        </div>

        <div class="pp-container">
            <div class="qr-card">
                <div class="qr-icon-wrap">
                    <q-icon name="qr_code_scanner" size="50px" color="white" />
                </div>

                <div class="qr-title">QR Code Scan</div>
                <div class="qr-subtitle">
                    Open the camera and scan the QR code on the vehicle. Swipe.
                </div>

                <q-btn icon="camera" outline rounded no-caps label="Camera" class="qr-btn" @click="open_scanner" />
                <div v-show="scanner_open" class="qr-reader-wrap">
                    <div id="qr-reader"></div>

                    <q-btn flat no-caps class="qr-cancel" label="Cancel" @click="close_scanner" />
                </div>
            </div>

            <div class="pp-separator">
                <div class="sep-line"></div>
                <div class="sep-text">OR</div>
                <div class="sep-line"></div>
            </div>

            <div class="public-section">
                <div class="pc-header">Public Code</div>
                <div class="pc-subheader">Search by entering the vehicle's general code.</div>

                <q-input v-model="public_code" rounded outlined placeholder="EX. PPPP-SSSS"
                    class="pc-input-field">
                    <template v-slot:prepend>
                        <q-icon name="tag" size="xs" color="grey-6" />
                    </template>
                </q-input>

                <q-btn unelevated rounded no-caps class="search-btn" @click="on_search">
                    <div class="row items-center justify-center full-width">
                        <span>Search</span>
                        <q-icon name="search" size="xs" class="q-ml-sm" />
                    </div>
                </q-btn>
            </div>
        </div>
    </q-page>
</template>

<script>
import { Html5Qrcode } from "html5-qrcode";
import { UseStore } from 'src/stores/store';
export default {
    setup() {
        var store = UseStore();
        return { store }
    },
    data() {
        return {
            public_code: "",
            scanner_open: false,
            scanning: false,
            qr: null,
            scan_lock: false
        }
    },
    beforeUnmount() {
        this.close_scanner();
    },
    async mounted() {
        var { qr_code_token } = this.$route.query;
        if (qr_code_token) await this.verify_qr_code(qr_code_token);
    },
    methods: {
        go_back() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.replace({ name: 'home' });
            }
        },
        async verify_qr_code(qr_code_token) {
            try {
                var res = await this.$api.post('/verify-access-token', { qr_code_token });
                if (res.status !== 200) return false;

                this.$router.push({ name: 'search-vehicle-plate' });
                return true;
            } catch (err) {
                console.error(err);
                return false;
            }
        },
        async on_search() {
            var code = (this.public_code || "").trim();
            if (!code) return;

            try {
                var res = await this.$api.post('/verify-access-token', { public_code: code });
                if (res.status !== 200) return;

                this.$router.push({ name: 'search-vehicle-plate' });
                return;
            } catch (err) {
                console.error(err);
            }
        },
        async open_scanner() {
            if (this.scanning) return;

            this.scanner_open = true;
            this.scan_lock = false;

            this.$nextTick(async () => {
                try {
                    this.qr = new Html5Qrcode("qr-reader");
                    this.scanning = true;

                    await this.qr.start(
                        { facingMode: "environment" },
                        { fps: 12, qrbox: { width: 240, height: 240 } },
                        async (decodedText) => {

                            if (this.scan_lock) return;
                            this.scan_lock = true;

                            var txt = (decodedText || "").trim();
                            if (!txt) {
                                this.scan_lock = false;
                                return;
                            }

                            var token = null;

                            try {
                                var url = new URL(txt);
                                token = url.searchParams.get("qr_code_token");
                            } catch (e) { }

                            if (!token) {
                                var m = txt.match(/(?:\?|&)qr_code_token=([^&]+)/i);
                                if (m && m[1]) token = decodeURIComponent(m[1]);
                            }

                            if (!token) {
                                this.scan_lock = false;
                                return;
                            }

                            await this.close_scanner();

                            var ok = await this.verify_qr_code(token);
                            if (!ok) this.scan_lock = false;
                        },

                        () => { }
                    );
                } catch (err) {
                    this.scanning = false;
                    this.qr = null;
                    this.scanner_open = false;
                    console.error(err);
                }
            });
        },
        async close_scanner() {
            try {
                if (this.qr && this.scanning) {
                    await this.qr.stop();
                    await this.qr.clear();
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.scanning = false;
                this.qr = null;
                this.scanner_open = false;
            }
        }
    }
}
</script>

<style scoped>
.pp-search-page {
    background: #1c1c22;
    min-height: 100vh;
    padding: 10px;
}

.pp-container {
    padding: 15px;
    max-width: 500px;
    margin: 0 auto;
}

.pp-topbar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70px;
    position: relative;
    padding: 0 10px;
}

.pp-back-btn {
    position: absolute;
    left: 10px;
    z-index: 10;
    color: #ffffff;
}

.qr-card {
    background: #2a2a33;
    border-radius: 40px;
    padding: 40px 20px;
    text-align: center;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
    margin-bottom: 40px;
    border: 1px solid rgba(255, 255, 255, 0.06);
}

.qr-icon-wrap {
    background: rgba(34, 197, 94, 0.12);
    width: 90px;
    height: 90px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 25px;
    border: 1px solid rgba(34, 197, 94, 0.18);
}

.qr-title {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 10px;
}

.qr-subtitle {
    font-size: 15px;
    color: #a0a3ad;
    line-height: 1.5;
    margin-bottom: 30px;
    padding: 0 30px;
}

.qr-btn {
    color: #e7e8ee;
    border-color: rgba(255, 255, 255, 0.10);
    background: rgba(255, 255, 255, 0.02);
    padding: 10px 35px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 1px;
}

.qr-reader-wrap {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

#qr-reader {
    width: 100%;
    max-width: 420px;
    border-radius: 22px;
    overflow: hidden;
    background: #0f1117;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.40);
    border: 1px solid rgba(255, 255, 255, 0.06);
}

.qr-cancel {
    color: #a0a3ad;
}

.pp-separator {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 40px;
}

.sep-line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.10);
}

.sep-text {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
    font-weight: 700;
    letter-spacing: 2px;
}

.public-section {
    text-align: center;
}

.pc-header {
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 6px;
}

.pc-subheader {
    font-size: 14px;
    color: #a0a3ad;
    margin-bottom: 25px;
}

.pc-input-field {
    margin-bottom: 20px;
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.25);
}

:deep(.q-field--outlined .q-field__control) {
    border-radius: 22px !important;
    height: 64px;
    background: #24242b;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

:deep(.q-field--outlined .q-field__control:before) {
    border: 1px solid rgba(255, 255, 255, 0.08);
}

:deep(.q-field--outlined .q-field__control:after) {
    border: 1px solid rgba(34, 197, 94, 0.35);
}

:deep(.q-field__native),
:deep(.q-field__input) {
    color: #ffffff;
    font-weight: 700;
    letter-spacing: 2px;
}

:deep(.q-field__native::placeholder),
:deep(.q-field__input::placeholder) {
    color: rgba(255, 255, 255, 0.28);
    font-weight: 800;
    letter-spacing: 3px;
}

.search-btn {
    width: 100%;
    height: 64px;
    background: #2a2a33;
    color: #ffffff;
    font-size: 18px;
    font-weight: 800;
    border-radius: 22px;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>