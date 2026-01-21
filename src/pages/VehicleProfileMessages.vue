<template>
    <q-page class="mh-page">
        <div class="mh-header">
            <q-btn flat round class="mh-icon-btn" @click="go_back">
                <q-icon name="arrow_back_ios_new" size="22px" />
            </q-btn>

            <div class="mh-head-mid">
                <q-avatar size="40px" class="mh-avatar">
                    <img :src="vehicle_owner_detail?.profile_picture" />
                </q-avatar>

                <div class="mh-head-txt">
                    <div class="mh-name">{{ vehicle_owner_detail?.full_name || '' }}</div>

                    <div class="mh-subrow">
                        <div class="mh-plate">{{ vehicle_owner_detail?.plate || '' }}</div>
                    </div>
                </div>
            </div>

           <!--  <q-btn flat round class="mh-icon-btn mh-icon-btn--muted">
                <q-icon name="more_horiz" size="22px" />
            </q-btn> -->
        </div>

        <div ref="scrollEl" class="mh-body hide-scrollbar">

            <div v-for="(m, idx) in conversation_messages" :key="m._id || idx" class="mh-row">
                <div :class="is_sent(m) ? 'mh-msg mh-msg--sent' : 'mh-msg mh-msg--recv'">
                    <div :class="bubble_class(m)">
                        <div class="mh-text">
                            <template v-if="is_warning(m)">
                                <div class="mh-warning-line">
                                    <q-icon name="warning" class="mh-warning-ic2" />
                                    <span class="mh-warning-name">{{ m.full_name || vehicle_owner_detail?.full_name ||
                                        'Unknown' }}</span>
                                    <span class="mh-warning-label">sent a warning:</span>
                                </div>
                                <div class="mh-warning-msg">"{{ m.message || '' }}"</div>
                            </template>
                            <template v-else>
                                {{ m.message }}
                            </template>
                        </div>
                    </div>

                    <div :class="is_sent(m) ? 'mh-time mh-time--sent' : 'mh-time mh-time--recv'">
                        <span>{{ m.created_date }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mh-footer">
            <div class="mh-e2ee">
                <q-icon name="lock" size="12px" />
                <div class="mh-e2ee-txt">END-TO-END ENCRYPTED</div>
            </div>
        </div>
    </q-page>
</template>

<script>
import { UseStore } from "../stores/store";

export default {
    setup() {
        var store = UseStore();
        return { store };
    },
    data: function () {
        return {
            current_user_id: null,
            vehicle_owner_id: null,
            vehicle_id: null,
            conversation_messages: [],
            vehicle_owner_detail: {},

            //Web Socket
            socket: null,
            isManualClose: false,
            reconnectAttempts: 0,
            reconnectTimer: null,
            heartbeatTimer: null,
            sendQueue: [],
            debounceTimer: null,
            showResume: false,
            resumeTimer: null,
        };
    },
    async created() {

        var { current_user_id, vehicle_owner_id, vehicle_id } = this.$route.query;

        this.current_user_id = current_user_id;
        this.vehicle_owner_id = vehicle_owner_id;
        this.vehicle_id = vehicle_id;

        await this.get_messages(vehicle_id);

        this.ws_connect();
    },
    beforeUnmount() {
        this.clean_up_ws(true);
        clearTimeout(this.resumeTimer);
    },
    mounted() {
        this.$nextTick(() => this.scroll_to_bottom());
    },
    updated() {
        this.$nextTick(() => this.scroll_to_bottom());
    },
    methods: {
        go_back() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.replace({ name: "home" });
            }
        },
        async get_messages(vehicle_id) {
            var res = await this.$api.get("/vehicle-profile-messages/" + vehicle_id);
            
            if( res.status === 403 ) this.go_back();

            if (res.status === 200) {
                this.conversation_messages = res.data?.conversation_messages || [];
                this.vehicle_owner_detail = res.data?.vehicle_owner_detail || {};
            }else{
                this.conversation_messages = [];
                this.vehicle_owner_detail = res?.response?.data?.vehicle_owner_detail || {};
            }
        },
        async delete_message(_id) {
            var res = await this.$api.put("/delete-message", { message_id: _id });
            if (res.status !== 200) return;
            this.conversation_messages = this.conversation_messages.filter(function (item) { return item._id !== _id });
        },
        is_sent(m) {
            return String(m?.sender_user_id || "") === String(this.store?.user_data?._id || "");
        },
        is_warning(m) {
            return String(m?.message_type || "").toLowerCase() === "warning";
        },
        bubble_class(m) {
            if (this.is_warning(m)) return "mh-bubble mh-bubble--warning";
            return this.is_sent(m) ? "mh-bubble mh-bubble--sent" : "mh-bubble mh-bubble--recv";
        },
        scroll_to_bottom() {
            var el = this.$refs.scrollEl;
            if (!el) return;
            el.scrollTop = el.scrollHeight;
        },
        watch_user_message() {

            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                var vehicle_id = this.vehicle_id;
                this.send_data_to_ws({ vehicle_id: vehicle_id });
            }, 300);
        },
        ws_connect() {
            var web_socket_api_url = import.meta.env.VITE_WEB_SOCKET_API_URL;
            try {
                this.socket = new WebSocket(web_socket_api_url);
            } catch (e) {
                console.error("Web Socket Error. ", e);
                return this.schedule_reconnect();
            }

            this.socket.onopen = () => {
                this.reconnectAttempts = 0;
                this.flush_queue();
                this.start_heart_beat();

                this.send_data_to_ws({ vehicle_id: this.vehicle_id, type: "vehicle_profile_chat_room_subscribe" });
            };

            this.socket.onmessage = (event) => {
                try {
                    var payload = JSON.parse(event.data);
                    var is_inserted = this.conversation_messages.find(function(item){ return item._id === payload._id});
                    if( !is_inserted && payload.conversation_id ) this.conversation_messages.push(payload);
                } catch (err) {
                    console.error(err);
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
                catch (err) { console.error(err) }
            }
            this.socket = null;
        }
    },
};
</script>

<style scoped>
.mh-page {
    background: #1c1c22;
    min-height: 100dvh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    color: #fff;
    overflow: hidden;
    font-family: "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
}

.mh-header {
    height: 64px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(28, 28, 34, 0.8);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    flex: 0 0 auto;
    z-index: 10;
}

.mh-icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    color: #fff;
}

.mh-icon-btn:hover {
    background: rgba(255, 255, 255, 0.10);
}

.mh-icon-btn--muted {
    color: rgba(255, 255, 255, 0.6);
}

.mh-head-mid {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 6px;
    min-width: 0;
}

.mh-avatar {
    border: 1px solid rgba(255, 255, 255, 0.10);
}

.mh-head-txt {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.mh-name {
    font-size: 13px;
    font-weight: 800;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mh-subrow {
    display: flex;
    align-items: center;
    gap: 6px;
}

.mh-online-dot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: #22c55e;
}

.mh-plate {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fff;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.mh-body {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 18px 14px 18px 14px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.mh-day {
    display: flex;
    justify-content: center;
}

.mh-day-txt {
    font-size: 11px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.30);
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.mh-row {
    display: block;
}

.mh-msg {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.mh-msg--recv {
    align-items: flex-start;
}

.mh-msg--sent {
    align-items: flex-end;
}

.mh-bubble {
    max-width: 85%;
    padding: 14px 16px;
    border-radius: 18px;
    word-wrap: break-word;
    overflow-wrap: anywhere;
}

.mh-bubble--recv {
    background: #2c2c34;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-top-left-radius: 6px;
}

.mh-bubble--sent {
    background: #256af4;
    border-top-right-radius: 6px;
    box-shadow: 0 12px 24px rgba(37, 106, 244, 0.20);
}

.mh-bubble--warning {
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.35);
    border-radius: 18px;
}

.mh-text {
    font-size: 15px;
    line-height: 1.55;
    color: #fff;
}

.mh-warning-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    line-height: 1.2;
    color: rgba(253, 230, 138, 0.9);
}

.mh-warning-ic2 {
    color: #f59e0b;
    font-size: 14px;
}

.mh-warning-name {
    font-weight: 800;
    color: rgba(253, 230, 138, 0.95);
}

.mh-warning-label {
    font-weight: 600;
    color: rgba(253, 230, 138, 0.75);
}

.mh-warning-msg {
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.4;
    color: rgba(253, 230, 138, 0.85);
}

.mh-time {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.40);
    margin: 0 6px;
}

.mh-time--recv {
    margin-left: 4px;
}

.mh-time--sent {
    margin-right: 4px;
}

.mh-read {
    color: rgba(255, 255, 255, 0.55);
    font-weight: 600;
}

.mh-footer {
    flex: 0 0 auto;
    padding: 10px 14px 18px 14px;
    background: rgba(28, 28, 34, 0.95);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.mh-e2ee {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    opacity: 0.40;
}

.mh-e2ee-txt {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
}
</style>