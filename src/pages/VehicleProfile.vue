<template>
    <q-page class="vd-page">
        <div class="vd-topbar">
            <q-btn flat round dense icon="chevron_left" class="vd-icon" v-on:click="go_back()" />
            <!-- <div class="vd-title">Vehicle Detail</div>
            <div style="width:35px"></div> -->
            <!-- <q-btn flat round dense icon="verified" class="vd-icon vd-ok" /> -->
        </div>
        <div class="vd-content">
            <div class="vd-gallery">
                <div class="vd-gallery-track">
                    <div v-for="(img, idx) in this.vehicle_detail?.vehicle_pictures" :key="idx" class="vd-shot"
                        :class="idx === 0 ? 'vd-shot--main' : 'vd-shot--side'">
                        <q-img :src="this.get_vehicle_picture(img._id)" class="vd-shot-img" spinner-color="primary"
                            no-native-menu fit="cover">
                        </q-img>
                    </div>
                </div>
            </div>
            <!-- <div class="vd-head">
                <div class="vd-head-row">
                    <div class="vd-veh-name">{{ this.vehicle_detail.make }}</div>
                </div>
                <div class="vd-veh-sub">{{ this.vehicle_detail.model }}</div>
            </div> -->
            <div class="vd-plate">
                <div class="vd-plate-label">MAKE/MODEL</div>
                <div class="vd-plate-value">{{ this.vehicle_detail.make }} - {{ this.vehicle_detail.model }}</div>
            </div>
            <div class="vd-plate">
                <div class="vd-plate-label">LICENSE PLATE</div>
                <div class="vd-plate-value">{{ this.vehicle_detail.plate }}</div>
            </div>
            <q-banner class="vd-notice" rounded
                v-on:click="go_vehicle_profile_messages()"
                v-if="this.vehicle_detail?.conversation_messages && this.vehicle_detail.conversation_messages.length">
                <template #avatar>
                    <q-icon name="warning" />
                </template>
                <div class="vd-notice-title">Active Notice</div>
                <div class="vd-notice-text">{{ this.vehicle_detail?.conversation_messages[this.vehicle_detail?.conversation_messages.length - 1].message }}</div>
            </q-banner>
            <div class="vd-section">
                <div class="vd-section-title">Vehicle Specifications</div>
                <q-separator class="vd-sep" />
                <div class="vd-spec-grid">
                    <div class="vd-spec">
                        <div class="vd-spec-k">BRAND</div>
                        <div class="vd-spec-v">{{ this.vehicle_detail.make }}</div>
                    </div>
                    <div class="vd-spec">
                        <div class="vd-spec-k">MODEL</div>
                        <div class="vd-spec-v">{{ this.vehicle_detail.model }}</div>
                    </div>
                    <div class="vd-spec">
                        <div class="vd-spec-k">COLOR</div>
                        <div class="vd-spec-v">
                            <span class="vd-color-dot" :style="{ background: this.vehicle_detail.color }"></span>
                            {{ this.vehicle_detail.color }}
                        </div>
                    </div>
                    <div class="vd-spec">
                        <div class="vd-spec-k">BODY TYPE</div>
                        <div class="vd-spec-v">{{ this.vehicle_detail.vehicle_type }}</div>
                    </div>
                    <div class="vd-spec">
                        <div class="vd-spec-k">REGISTERED SINCE</div>
                        <div class="vd-spec-v">{{ this.vehicle_detail.created_date }}</div>
                    </div>
                </div>
            </div>
            <div class="vd-section">
                <div class="vd-owner-row">
                    <div class="vd-section-title q-mb-none">Owner Information</div>
                </div>
                <q-card flat bordered class="vd-owner-card">
                    <q-item class="vd-owner-top" clickable v-ripple>
                        <q-item-section avatar>
                            <q-avatar size="40px">
                                <img :src="this.vehicle_detail?.owner_details?.profile_picture" />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="vd-owner-name">{{ this.vehicle_detail?.owner_details?.name }} {{
                                this.vehicle_detail?.owner_details?.surname }}</q-item-label>
                            <q-item-label caption class="vd-owner-verified">Verified Owner</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item class="vd-field vd-copy" clickable v-ripple
                        @click="copy_text(this.vehicle_detail?.owner_details?.formatted_phone_number, 'Phone copied')">
                        <q-item-section avatar>
                            <q-icon name="call" class="vd-field-ic" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="vd-field-k">Phone Number</q-item-label>
                            <q-item-label class="vd-field-v">{{
                                this.vehicle_detail?.owner_details?.formatted_phone_number
                                }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-icon name="content_copy" class="vd-copy-ic" />
                        </q-item-section>
                    </q-item>
                    <q-item class="vd-field vd-copy" clickable v-ripple
                        @click="copy_text(this.vehicle_detail.owner_details.email_address, 'Email copied')">
                        <q-item-section avatar>
                            <q-icon name="mail" class="vd-field-ic" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="vd-field-k">Email Address</q-item-label>
                            <q-item-label class="vd-field-v">{{ this.vehicle_detail?.owner_details?.email_address
                                }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-icon name="content_copy" class="vd-copy-ic" />
                        </q-item-section>
                    </q-item>
                </q-card>
            </div>
            <div class="vd-bottom">
                <q-btn 
                    v-on:click="send_message_to_vehicle_owner()"
                    :disabled="this.is_user_temporary() && this.is_vehicle_owner_allow_message()"
                    unelevated no-caps class="vd-cta" :disable="!this.vehicle_detail?.owner_details?.allow_message">
                    <q-icon name="chat_bubble" class="vd-cta-ic" />
                    <span class="vd-cta-txt">Leave Message</span>
                </q-btn>
            </div>
        </div>
    </q-page>
</template>

<script>
import { UseStore } from '../stores/store';
import { copyToClipboard } from 'quasar';

export default {
    setup() {
        const store = UseStore();
        return { store }
    },
    data: function () {
        return {
            loading: false,
            error: "",
            socket: null,
            isManualClose: false,
            reconnectAttempts: 0,
            reconnectTimer: null,
            heartbeatTimer: null,
            sendQueue: [],
            debounceTimer: null,
            showResume: false,
            resumeTimer: null,
            conversation_message: '',
            vehicle_id: null,
            vehicle_detail: {}
        }
    },
    async created() {
        var { vehicle_id } = this.$route.params;
        await this.get_vehicle_detail(vehicle_id);
        this.ws_connect();
    },
    beforeUnmount() {
        this.clean_up_ws(true);
        clearTimeout(this.resumeTimer);
    },
    methods: {
        go_vehicle_profile_messages(){
            
            var vehicle_owner_id = this.vehicle_detail.owner_details._id;
            var current_user_id = this.store.user_data._id;
            var vehicle_id = this.vehicle_detail._id;

            if( !vehicle_owner_id || !current_user_id || !vehicle_id ) return;

            this.$router.push({ name: 'vehicle-profile-messages', query:{ vehicle_owner_id: vehicle_owner_id, current_user_id: current_user_id, vehicle_id: vehicle_id }});
        
        },  
        is_vehicle_owner_allow_message(){
            var vehicle_owner_detail = this.vehicle_detail.owner_details;
            if( 'allow_message' in vehicle_owner_detail ) return vehicle_owner_detail.allow_message;
            else return false;
        },
        send_message_to_vehicle_owner(){
            var vehicle_owner_id = this.vehicle_detail.owner_details._id;
            var current_user_id = this.store.user_data._id;

            if( !vehicle_owner_id || !current_user_id ) return;

            this.$router.push({ name: 'send-message', query:{ vehicle_owner_id: vehicle_owner_id, current_user_id: current_user_id, vehicle_id: this.vehicle_detail._id }});
        },
        is_user_temporary(){
            return this.store?.user_data?.temporary === true ? true : false;
        },
        go_back() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.replace({ name: 'home' });
            }
        },
        async get_vehicle_detail(vehicle_id) {
            var res = await this.$api.post('/vehicle-detail', { vehicle_id: vehicle_id });
            console.log("vehicle_detail_service -> " + JSON.stringify(res));
            if (res.status !== 200) this.$router.replace({ path: '/home' });

            this.vehicle_detail = res.data.vehicle_detail;
            this.vehicle_id = this.vehicle_detail._id;

            console.log(JSON.stringify(this.vehicle_detail));
        },
        watch_user_message() {
            if (!this.conversation_message) return;

            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                var vehicle_id = this.vehicle_id;
                this.send_data_to_ws({ conversation_message: this.conversation_message, vehicle_id: vehicle_id });
            }, 300);
        },
        ws_connect() {
            var web_socket_api_url = import.meta.env.VITE_WEB_SOCKET_API_URL;
            try {
                this.socket = new WebSocket(web_socket_api_url);
                console.log(this.socket)
            } catch (e) {
                console.error("Web Socket Error. ", e);
                return this.schedule_reconnect();
            }

            this.socket.onopen = () => {
                this.reconnectAttempts = 0;
                this.flush_queue();
                this.start_heart_beat();
                if (this.conversation_message) {
                    var vehicle_id = this.vehicle_id;
                    this.send_data_to_ws({ conversation_message: this.conversation_message, vehicle_id: vehicle_id });
                }
            };

            this.socket.onmessage = (event) => {
                try {
                    var payload = JSON.parse(event.data);
                    console.log("data from backend -> " + JSON.stringify(payload));
                } catch (err) {
                    console.log(err);
                }
            };

            this.socket.onerror = (err) => console.warn("Web Socket Error. ", err?.message || err);
            this.socket.onclose = () => {
                this.stop_heart_beat();
                if (!this.isManualClose) this.schedule_reconnect();
            };
        },
        send_data_to_ws(payload) {
            var data = JSON.stringify(payload);
            if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.send(data);
            else this.sendQueue.push(data);
        },
        flush_queue() {
            while (this.sendQueue.length && this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send(this.sendQueue.shift());
            }
        },
        schedule_reconnect() {
            var delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts++), 15000);
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = setTimeout(() => this.ws_connect(), delay);
        },
        start_heart_beat() {
            this.stop_heart_beat();
            this.heartbeatTimer = setInterval(() => {
                if (this.socket?.readyState === WebSocket.OPEN)
                    this.socket.send(JSON.stringify({ type: "ping", t: Date.now() }));
            }, 25_000);
        },
        stop_heart_beat() {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        },
        clean_up_ws(manual = false) {
            this.isManualClose = manual;
            clearTimeout(this.reconnectTimer);
            this.stop_heart_beat();

            if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
                try { this.socket.close(1000, "client closing"); }
                catch (err) { console.log(err) }
            }
            this.socket = null;
        },
        get_vehicle_picture(file_id) {
            var backend_url = import.meta.env.VITE_BACKEND_URL;
            return backend_url + '/picture/' + file_id;
        },
        copy_text(val, okMsg) {
            var s = (val === null || val === undefined) ? "" : String(val).trim();
            if (!s || s === "-") return;
            copyToClipboard(s)
                .then(() => { this.$q.notify({ type: "positive", message: okMsg, timeout: 1200, position: "top" }); })
                .catch(() => { this.$q.notify({ type: "negative", message: "Copy failed", timeout: 1400, position: "top" }); });
        }
    }
}
</script>

<style scoped>
.vd-page {
    background: #1C1C22;
    color: #ffffff;
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

.vd-content {
    padding: 10px 14px 18px 14px;
}

.vd-gallery {
    overflow: hidden;
}

.vd-gallery-track {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 6px;
    scroll-snap-type: x mandatory;
}

.vd-gallery-track::-webkit-scrollbar {
    height: 0;
}

.vd-shot {
    flex: 0 0 auto;
    scroll-snap-align: start;
    border-radius: 16px;
    overflow: hidden;
    background: #24242b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
    position: relative;
}

.vd-shot--main {
    width: 248px;
}

.vd-shot--side {
    width: 140px;
    opacity: 0.95;
}

.vd-shot-img {
    height: 176px;
    border-radius: 16px;
}

.vd-shot-label {
    position: absolute;
    left: 10px;
    bottom: 10px;
    background: rgba(12, 12, 16, 0.7);
    color: #ffffff;
    font-size: 11px;
    padding: 5px 9px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.10);
}

.vd-head {
    margin-top: 14px;
}

.vd-head-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.vd-veh-name {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.1;
    flex: 1;
}

.vd-veh-sub {
    margin-top: 6px;
    color: rgba(255, 255, 255, 0.62);
    font-size: 12.5px;
}

.vd-plate {
    margin-top: 12px;
    background: #24242b;
    border-radius: 14px;
    padding: 12px 12px 12px 14px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
}

.vd-plate:before {
    content: "";
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 4px;
    border-radius: 6px;
    background: #2563eb;
}

.vd-plate-label {
    font-size: 10px;
    letter-spacing: 0.7px;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 800;
}

.vd-plate-value {
    margin-top: 4px;
    font-size: 16px;
    font-weight: 850;
    color: #ffffff;
}

.vd-notice {
    margin-top: 12px;
    background: rgba(255, 149, 0, 0.08);
    border: 1px solid rgba(255, 149, 0, 0.35);
    color: #ffffff;
    padding: 12px 12px;
    border-radius: 14px;
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
}

.vd-notice :deep(.q-banner__avatar) {
    min-width: 28px;
}

.vd-notice :deep(.q-icon) {
    color: #ff9b1a;
}

.vd-notice-title {
    font-weight: 850;
    font-size: 13px;
    margin-bottom: 2px;
    color: #ffb35a;
}

.vd-notice-text {
    font-size: 12.5px;
    color: rgba(255, 255, 255, 0.86);
    line-height: 1.25;
}

.vd-notice-sub {
    margin-top: 2px;
    font-size: 12px;
    color: rgba(255, 179, 90, 0.9);
}

.vd-section {
    margin-top: 16px;
    background: #24242b;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 14px 14px 12px 14px;
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.26);
}

.vd-section-title {
    font-weight: 850;
    font-size: 14px;
    color: #ffffff;
}

.vd-owner-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.vd-sep {
    margin: 10px 0 12px 0;
    background: rgba(255, 255, 255, 0.08);
}

.vd-spec-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 18px;
}

.vd-spec-k {
    font-size: 10px;
    letter-spacing: 0.65px;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 850;
}

.vd-spec-v {
    margin-top: 4px;
    font-size: 13px;
    font-weight: 800;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 8px;
}

.vd-color-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
}

.vd-owner-card {
    background: #24242b;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.26);
}

.vd-owner-top {
    padding-top: 12px;
    padding-bottom: 12px;
}

.vd-owner-card :deep(.q-item) {
    color: #ffffff;
}

.vd-owner-card :deep(.q-separator) {
    background: rgba(255, 255, 255, 0.08);
}

.vd-owner-name {
    font-weight: 850;
    color: #ffffff;
}

.vd-owner-verified {
    color: rgba(255, 255, 255, 0.62);
    font-weight: 700;
}

.vd-avatar-fallback {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    color: #ffffff;
    font-weight: 900;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.10);
}

.vd-field {
    padding-top: 10px;
    padding-bottom: 10px;
}

.vd-field-ic {
    color: rgba(255, 255, 255, 0.9);
}

.vd-copy {
    cursor: pointer;
}

.vd-copy-ic {
    color: rgba(255, 255, 255, 0.55);
}

.vd-field-k {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.62);
    font-weight: 750;
}

.vd-field-v {
    font-size: 13px;
    color: #ffffff;
    font-weight: 800;
}

.vd-bottom {
    margin-top: 14px;
    padding: 0 4px 6px 4px;
}

.vd-cta {
    width: 100%;
    height: 50px;
    border-radius: 16px;
    background: #f3f4f6;
    color: #111827;
    box-shadow: 0 14px 22px rgba(0, 0, 0, 0.24);
    padding: 0 14px;
}

.vd-cta :deep(.q-btn__content) {
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-weight: 850;
    font-size: 14.5px;
    letter-spacing: 0.15px;
    line-height: 1;
}

.vd-cta :deep(.q-icon) {
    font-size: 18px;
    color: #111827;
}

.vd-cta-ic {
    transform: translateY(0.5px);
}

.vd-cta:disabled {
    opacity: 0.45;
}
</style>