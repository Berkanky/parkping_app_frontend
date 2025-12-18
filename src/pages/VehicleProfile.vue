<template>
    <div>
<!--         <q-input v-model="this.conversation_message" v-on:keyup.enter="watch_user_message()"></q-input>
 -->    </div>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
    setup() {
        const store = UseStore();
        return {
            store
        }
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
            vehicle_id: "6935970a0cb97cc2951ccb71"
        }
    },
    async mounted() {
        this.WSConnect();
    },
    beforeUnmount() {
        this.cleanupWS(true);
        clearTimeout(this.resumeTimer);
    },
    methods: {
        watch_user_message() {
            if (!this.conversation_message) return;

            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                var vehicle_id = this.vehicle_id;
                this.sendWS({ conversation_message: this.conversation_message, vehicle_id: vehicle_id});
            }, 300);
        },
        WSConnect() {
            var web_socket_api_url = process.env.VITE_WEB_SOCKET_API_URL;
            try {

                this.socket = new WebSocket(web_socket_api_url);
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
                try {
                    this.socket.close(1000, "client closing");
                } catch (err) {
                    console.log(err)
                }
            }
            this.socket = null;
        },
        async onSubmit() {
            //
        },
    }
}
</script>