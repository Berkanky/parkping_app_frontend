<template>
    <q-page class="pp-auth">
        <div class="pp-topbar text-white">
            <q-btn flat round icon="chevron_left" class="pp-back" @click="go_back" />
            <q-avatar size="md" class="pp-logo">
                <img src="../images/splash_screen_logo.svg" alt="">
            </q-avatar>
        </div>

        <div class="pc-wrap">
            <div class="pc-mid">
                <div class="pc-title">Public Code</div>
                <q-input v-model="public_code" class="pc-input text-white" borderless placeholder="Ex. PPPP-SSSS"
                    input-class="pc-input-native" />
            </div>

            <div class="pc-bottom">
                <q-btn icon="search" unelevated no-caps class="pc-btn" label="Search" @click="on_search" />
            </div>
        </div>
    </q-page>
</template>

<script>
import { UseStore } from 'src/stores/store';
export default {
    name: "PublicCodeSearch",
    setup() {
        var store = UseStore();
        return { store }
    },
    data() {
        return {
            public_code: ""
        }
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
            var res = await this.$api.post('/verify-access-token', { qr_code_token: qr_code_token });
            if (res.status !== 200) return;

            this.$router.push({ name: 'search-vehicle-plate' });
        },
        async on_search() {
            var code = (this.public_code || "").trim();
            if (!code) return;

            var res = await this.$api.post('/verify-access-token', { public_code: code });
            if (res.status !== 200) return;

            this.$router.push({ name: 'search-vehicle-plate' });
        }
    }
}
</script>

<style>
.pp-auth {
    background: #1c1c22;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.pp-topbar {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 6px 10px 0 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    position: relative;
}

.pp-back {
    width: 40px;
    height: 40px;
    border-radius: 14px;
}

.pc-wrap {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: 28px 18px 22px;
}

.pc-mid {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
}

.pc-title {
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
    text-align: center;
}

.pc-input {
    width: min(92%, 440px);
    background: #24242b;
    border-radius: 12px;
    padding: 6px 14px;
    height: 56px;
    display: flex;
    align-items: center;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .05);
}

.pc-input .q-field__control,
.pc-input .q-field__control-container {
    height: 56px;
}

.pc-input-native {
    color: #ffffff !important;
    font-size: 16px;
    letter-spacing: .2px;
}

.pc-input .q-field__native::placeholder {
    color: rgba(255, 255, 255, .35);
}

.pc-bottom {
    display: flex;
    justify-content: center;
    padding-top: 14px;
}

.pc-btn {
    width: min(92%, 440px);
    border-radius: 12px;
    background: #ffffff;
    color: #1c1c22;
    font-size: 16px;
    font-weight: 500;
}

.pp-logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 104px;
    height: 64px;
}

.pp-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>