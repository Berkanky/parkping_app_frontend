<template>
    <q-page class="vd-page">
        <div class="vd-topbar">
            <q-btn flat round dense icon="arrow_back" class="vd-icon" v-on:click="goBack()" />
            <div class="vd-title">Vehicle Detail</div>
            <q-btn flat round dense icon="check_circle" class="vd-icon vd-ok" />
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

            <div class="vd-head">
                <div class="vd-head-row">
                    <div class="vd-veh-name">{{ this.vehicle_detail.make }}</div>
                </div>
                <div class="vd-veh-sub">{{ this.vehicle_detail.model }}</div>
            </div>

            <div class="vd-plate">
                <div class="vd-plate-label">LICENSE PLATE</div>
                <div class="vd-plate-value">{{ this.vehicle_detail.plate }}</div>
            </div>
            <q-banner class="vd-notice" rounded v-if="this.vehicle_detail?.conversation_messages && this.vehicle_detail.conversation_messages.length">
                <template #avatar>
                    <q-icon name="warning" />
                </template>
                <div class="vd-notice-title">Active Notice</div>
                <div class="vd-notice-text">{{ this.vehicle_detail?.conversation_messages[0].message }}</div>
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
                        @click="copyText(this.vehicle_detail?.owner_details?.formatted_phone_number, 'Phone copied')">
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
                        @click="copyText(this.vehicle_detail.owner_details.email_address, 'Email copied')">
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

            <!-- normal bottom button (not sticky) -->
            <div class="vd-bottom">
                <q-btn unelevated no-caps class="vd-cta" :disable="!this.vehicle_detail?.owner_details?.allow_message">
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
        this.WSConnect();
    },
    beforeUnmount() {
        this.cleanupWS(true);
        clearTimeout(this.resumeTimer);
    },
    methods: {
        goBack(){
            if( this.$router ) this.$router.back();
            else this.$router.push({name:'home'});
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
                this.sendWS({ conversation_message: this.conversation_message, vehicle_id: vehicle_id });
            }, 300);
        },
        WSConnect() {
            var web_socket_api_url = import.meta.env.VITE_WEB_SOCKET_API_URL;
            try {
                this.socket = new WebSocket(web_socket_api_url);
                console.log(this.socket)
            } catch (e) {
                console.error("Web Socket Error. ", e);
                return this.scheduleReconnect();
            }

            this.socket.onopen = () => {
                this.reconnectAttempts = 0;
                this.flushQueue();
                this.startHeartbeat();
                if (this.conversation_message) {
                    var vehicle_id = this.vehicle_id;
                    this.sendWS({ conversation_message: this.conversation_message, vehicle_id: vehicle_id });
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
                this.stopHeartbeat();
                if (!this.isManualClose) this.scheduleReconnect();
            };
        },
        sendWS(payload) {
            var data = JSON.stringify(payload);
            if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.send(data);
            else this.sendQueue.push(data);
        },
        flushQueue() {
            while (this.sendQueue.length && this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send(this.sendQueue.shift());
            }
        },
        scheduleReconnect() {
            var delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts++), 15000);
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = setTimeout(() => this.WSConnect(), delay);
        },
        startHeartbeat() {
            this.stopHeartbeat();
            this.heartbeatTimer = setInterval(() => {
                if (this.socket?.readyState === WebSocket.OPEN)
                    this.socket.send(JSON.stringify({ type: "ping", t: Date.now() }));
            }, 25_000);
        },
        stopHeartbeat() {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        },
        cleanupWS(manual = false) {
            this.isManualClose = manual;
            clearTimeout(this.reconnectTimer);
            this.stopHeartbeat();

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
        copyText(val, okMsg) {
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
    background: #ffffff;
}

.vd-topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    background: #ffffff;
}

.vd-title {
    flex: 1;
    text-align: center;
    font-weight: 650;
    font-size: 16px;
    color: #111827;
    letter-spacing: 0.2px;
}

.vd-icon {
    color: #111827;
}

.vd-ok {
    color: #2563eb;
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
    padding-bottom: 2px;
    scroll-snap-type: x mandatory;
}

.vd-gallery-track::-webkit-scrollbar {
    height: 0;
}

.vd-shot {
    flex: 0 0 auto;
    scroll-snap-align: start;
    border-radius: 14px;
    overflow: hidden;
    background: #f3f4f6;
    box-shadow: 0 8px 24px rgba(17, 24, 39, 0.08);
}

.vd-shot--main {
    width: 240px;
}

.vd-shot--side {
    width: 130px;
    opacity: 0.92;
}

.vd-shot-img {
    height: 190px;
    border-radius: 14px;
}

.vd-shot-label {
    position: absolute;
    left: 10px;
    bottom: 10px;
    background: rgba(17, 24, 39, 0.65);
    color: #fff;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 10px;
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
    font-weight: 750;
    color: #111827;
    line-height: 1.1;
    flex: 1;
}

.vd-veh-sub {
    margin-top: 6px;
    color: #6b7280;
    font-size: 12.5px;
}

.vd-chip {
    background: #eaf7ee;
    color: #117a37;
    border-radius: 10px;
    font-weight: 650;
}

.vd-chip-muted {
    background: #f3f4f6;
    color: #6b7280;
    border-radius: 10px;
    font-weight: 650;
}

.vd-plate {
    margin-top: 12px;
    background: #f3f4f6;
    border-radius: 12px;
    padding: 12px 12px 12px 14px;
    position: relative;
    overflow: hidden;
    border: 1px solid #eef2f7;
}

.vd-plate:before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 6px;
    background: #2563eb;
}

.vd-plate-label {
    font-size: 10px;
    letter-spacing: 0.7px;
    color: #9ca3af;
    font-weight: 750;
}

.vd-plate-value {
    margin-top: 4px;
    font-size: 16px;
    font-weight: 800;
    color: #111827;
}

.vd-notice {
    margin-top: 12px;
    background: #fff7ed;
    border: 1px solid #fed7aa;
    color: #7c2d12;
    padding: 10px 12px;
}

.vd-notice-title {
    font-weight: 800;
    font-size: 13px;
    margin-bottom: 2px;
}

.vd-notice-text {
    font-size: 12.5px;
    color: #9a3412;
    line-height: 1.25;
}

.vd-notice-sub {
    margin-top: 2px;
    font-size: 12px;
    color: #b45309;
}

.vd-section {
    margin-top: 16px;
}

.vd-section-title {
    font-weight: 800;
    font-size: 14px;
    color: #111827;
}

.vd-owner-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.vd-sep {
    margin: 10px 0 12px 0;
}

.vd-spec-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 18px;
}

.vd-spec-k {
    font-size: 10px;
    letter-spacing: 0.6px;
    color: #9ca3af;
    font-weight: 800;
}

.vd-spec-v {
    margin-top: 4px;
    font-size: 13px;
    font-weight: 750;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 8px;
}

.vd-color-dot {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.12);
}

.vd-owner-card {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid #eef2f7;
}

.vd-owner-top {
    padding-top: 12px;
    padding-bottom: 12px;
}

.vd-owner-name {
    font-weight: 800;
    color: #111827;
}

.vd-owner-verified {
    color: #6b7280;
    font-weight: 650;
}

.vd-avatar-fallback {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: #e5e7eb;
    color: #111827;
    font-weight: 900;
}

.vd-field {
    padding-top: 10px;
    padding-bottom: 10px;
}

.vd-field-ic {
    color: #111827;
}

.vd-copy {
    cursor: pointer;
}

.vd-copy-ic {
    color: #9ca3af;
}

.vd-field-k {
    font-size: 12px;
    color: #6b7280;
    font-weight: 700;
}

.vd-field-v {
    font-size: 13px;
    color: #111827;
    font-weight: 750;
}

/* bottom button as normal block */
.vd-bottom {
    margin-top: 14px;
    padding: 0 4px 6px 4px;
}

.vd-cta {
    width: 100%;
    height: 48px;
    border-radius: 14px;
    background: #0b0b0d;
    color: #ffffff;
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.14);
    padding: 0 14px;
}

.vd-cta :deep(.q-btn__content) {
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 14.5px;
    letter-spacing: 0.15px;
    line-height: 1;
}

.vd-cta :deep(.q-icon) {
    font-size: 18px;
}

.vd-cta-ic {
    transform: translateY(0.5px);
}

.vd-cta:disabled {
    opacity: 0.45;
}
</style>