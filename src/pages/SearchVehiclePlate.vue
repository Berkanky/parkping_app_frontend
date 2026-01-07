<template>
    <q-page class="pp-auth">
        <div class="pp-topbar text-white">
            <q-btn flat round icon="chevron_left" class="pp-back" @click="go_back" />
            <q-avatar size="md" class="pp-logo">
                <img src="../images/splash_screen_logo.svg" alt="">
            </q-avatar>
        </div>
        <div class="pp-wrap">

            <div class="pp-mid">
                <div class="pp-title">Vehicle Plate</div>

                <q-input v-model="plate" class="pp-input text-white" borderless placeholder="Ex. 34 ARG 76"
                    input-class="pp-input-native" />
            </div>

            <div class="pp-bottom">
                <q-btn icon="search" unelevated no-caps class="pp-btn" label="Search" @click="on_search()" />
            </div>
        </div>
    </q-page>
</template>

<script>
import { UseStore } from 'src/stores/store';
export default {
    name: "VehiclePlateSearch",
    setup() {
        var store = UseStore();
        return {
            store
        }
    },
    data() {
        return {
            plate: ""
        }
    },
    methods: {
        go_back() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.replace({ name: 'home' });
            }
        },
        async on_search() {
            var res = await this.$api.post('/search-vehicle-plate', { plate: this.plate });
            if (res.status !== 200) return;

            var { vehicle_id } = res.data;

            this.$router.push({ name: 'vehicle-profile', params: { vehicle_id: vehicle_id } });
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
    background-image: url("../images/BG-parkping.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.pp-topbar {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 6px 10px 0 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    position: relative;
}

.pp-wrap {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: 28px 18px 22px;
}

.pp-mid {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin-top: 0;
}

.pp-back {
    width: 40px;
    height: 40px;
    border-radius: 14px;
}

.pp-title {
    font-size: 20px;
    font-weight: 700;
}

.pp-topbar-spacer {
    width: 40px;
    height: 40px;
}

.pp-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 6px;
}

.pp-mark {
    width: 28px;
    height: 28px;
    flex: 0 0 28px;
}

.pp-brand {
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: .2px;
}

.pp-title {
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
    text-align: center;
}

.pp-input {
    width: min(92%, 440px);
    background: #24242b;
    border-radius: 12px;
    padding: 6px 14px;
    height: 56px;
    display: flex;
    align-items: center;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .05);
}

.pp-input .q-field__control,
.pp-input .q-field__control-container {
    height: 56px;
}

.pp-input-native {
    color: #ffffff !important;
    font-size: 16px;
    letter-spacing: .2px;
}

.pp-input .q-field__native::placeholder {
    color: rgba(255, 255, 255, .35);
}

.pp-bottom {
    display: flex;
    justify-content: center;
    padding-top: 14px;
}

.pp-btn {
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