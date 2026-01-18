<template>
    <q-page class="pp-send">
        <div class="pp-topbar">
            <q-btn flat round dense icon="chevron_left" class="pp-back" @click="go_back()" />
            <div class="pp-topbar-title">Send Message</div>
            <div class="pp-topbar-spacer"></div>
        </div>

        <div class="pp-wrap">
            <div class="pp-header">
                <div class="pp-avatar-wrap">
                    <q-avatar size="92px" class="pp-avatar">
                        <q-img :src="this.vehicle_owner_detail.profile_picture" class="pp-avatar-img" fit="cover"
                            no-spinner>
                            <template v-slot:error>
                                <div class="pp-avatar-ph">
                                    <q-icon name="person" size="44px" class="pp-avatar-ic" />
                                </div>
                            </template>
                        </q-img>
                    </q-avatar>
                </div>

                <div class="pp-name">{{ this.vehicle_owner_detail.full_name }}</div>
                <div class="pp-code-pill">{{ this.vehicle_owner_detail.plate }}</div>
            </div>

            <div class="pp-type-row">
                <button class="pp-type-btn" :class="message_type === 'warning' ? 'pp-type-btn--active' : ''"
                    type="button" @click="message_type = 'warning'">
                    <div class="pp-type-ic">
                        <q-icon name="warning_amber" size="22px" />
                    </div>
                    <div class="pp-type-txt">Warning</div>
                </button>

                <button class="pp-type-btn" :class="message_type === 'info' ? 'pp-type-btn--active' : ''" type="button"
                    @click="message_type = 'info'">
                    <div class="pp-type-ic">
                        <q-icon name="info" size="22px" />
                    </div>
                    <div class="pp-type-txt">Info</div>
                </button>

                <button class="pp-type-btn" :class="message_type === 'feedback' ? 'pp-type-btn--active' : ''"
                    type="button" @click="message_type = 'feedback'">
                    <div class="pp-type-ic">
                        <q-icon name="star" size="22px" />
                    </div>
                    <div class="pp-type-txt">Feedback</div>
                </button>
            </div>

            <div class="pp-box">
                <q-input v-model="message" type="textarea" autogrow borderless class="pp-input"
                    input-class="pp-input-native" placeholder="Type your message to the owner..." />
                <div v-if="pictures && pictures.length" class="pp-pics">
                    <div v-for="(p, idx) in pictures" :key="p.file_id || idx" class="pp-pic">
                        <q-img :src="get_message_picture_src(p.file_id)" class="pp-pic-img" fit="cover" no-spinner />
                        <button class="pp-pic-del" type="button" @click="remove_picture(p.file_id)">
                            <q-icon name="close" size="16px" />
                        </button>
                    </div>
                </div>
                <div class="pp-box-hint">Markdown supported</div>
            </div>
        </div>

        <div class="pp-bottom">
            <q-btn unelevated no-caps class="pp-send-btn" label="Send Message" @click="send_message()">
                <q-icon name="send" size="20px" class="pp-send-btn-ic" />
            </q-btn>
        </div>

        <input ref="ppFile" class="pp-file" type="file" accept="image/*" multiple @change="on_picture_selected" />

    </q-page>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
    setup() {
        var store = UseStore();
        return {
            store
        }
    },
    data: function () {
        return {
            message: null,
            pictures: [],
            message_type: 'warning',
            current_user_id: null,
            vehicle_owner_id: null,
            vehicle_id: null,
            vehicle_owner_detail: {}
        }
    },
    async created() {
        var { current_user_id, vehicle_owner_id, vehicle_id } = this.$route.query;

        this.current_user_id = current_user_id;
        this.vehicle_owner_id = vehicle_owner_id;
        this.vehicle_id = vehicle_id;

        await this.get_messages(vehicle_id);
    },
    methods: {
        go_back() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.replace({ name: 'home' });
            }
        },
        async upload_picture() {
            if (!this.$refs.ppFile) return;
            this.$refs.ppFile.value = null;
            this.$refs.ppFile.click();
        },
        async on_picture_selected(e) {
            var files = Array.from(e.target.files || []);
            if (!files.length) return;

            var remain = 3 - (this.pictures?.length || 0);
            if (remain <= 0) return;

            files = files.slice(0, remain);

            var form = new FormData();
            form.append("vehicle_id", this.vehicle_id);

            for (var i = 0; i < files.length; i++) {
                form.append("message_pictures", files[i]);
            }

            var res = await this.$api.post("/send-picture", form, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.status !== 200) return;

            var incoming = res.data?.pictures || [];
            this.pictures = (this.pictures || []).concat(incoming);
        },
        remove_picture(file_id) {
            this.pictures = (this.pictures || []).filter(function (p) {
                return p.file_id !== file_id;
            });
        },
        async send_message() {
            if (!this.message) return;

            var request_body = {
                message: this.message,
                message_type: this.message_type,
                vehicle_id: this.vehicle_id,
                pictures: this.pictures.length > 0 ? this.pictures : []
            };

            var res = await this.$api.post('/send-message', request_body);
            if (res.status !== 200) return;

            this.message = null;
            this.message_type = 'warning';
            this.pictures = [];
        },
        async get_messages(vehicle_id) {
            var res = await this.$api.get("/vehicle-profile-messages/" + vehicle_id);
            if( res.status === 200 ) this.vehicle_owner_detail = res.data?.vehicle_owner_detail || {};
            else this.vehicle_owner_detail = res?.response?.data?.vehicle_owner_detail || {};
        },
        get_message_picture_src(_id) {
            var backend_url = import.meta.env.VITE_BACKEND_URL;
            return backend_url + '/picture/' + _id;
        }
    },
}
</script>

<style scoped>
.pp-send {
    min-height: 100vh;
    background: radial-gradient(1200px 700px at 50% -10%, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0) 55%), #0f1116;
    color: #e9eefc;
    position: relative;
    padding-bottom: calc(96px + env(safe-area-inset-bottom));
}

.pp-topbar {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 14px;
    position: relative;
}

.pp-back {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.9);
}

.pp-topbar-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: rgba(255, 255, 255, 0.92);
}

.pp-topbar-spacer {
    position: absolute;
    right: 10px;
    width: 36px;
    height: 36px;
}

.pp-wrap {
    max-width: 520px;
    margin: 0 auto;
    padding: 10px 18px 0;
}

.pp-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 14px;
}

.pp-avatar-wrap {
    position: relative;
    width: 92px;
    height: 92px;
    display: grid;
    place-items: center;
    margin-bottom: 10px;
}

.pp-avatar {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.pp-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    overflow: hidden;
}

.pp-avatar-img :deep(.q-img__image) {
    object-fit: cover;
}

.pp-avatar-ph {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: radial-gradient(120px 120px at 30% 25%, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06));
}

.pp-avatar-ic {
    color: rgba(255, 255, 255, 0.65);
}

.pp-name {
    font-size: 18px;
    font-weight: 700;
    margin-top: 2px;
    color: rgba(255, 255, 255, 0.94);
}

.pp-code-pill {
    margin-top: 8px;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(54, 142, 255, 0.14);
    border: 1px solid rgba(54, 142, 255, 0.28);
    color: rgba(160, 205, 255, 0.95);
    letter-spacing: 1.2px;
}

.pp-type-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 8px;
    margin-bottom: 14px;
}

.pp-type-btn {
    appearance: none;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    border-radius: 16px;
    padding: 12px 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.72);
    transition: transform .08s ease, border-color .15s ease, background .15s ease, box-shadow .15s ease;
}

.pp-type-btn:active {
    transform: scale(0.99);
}

.pp-type-ic {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.22);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.pp-type-txt {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.62);
}

.pp-type-btn--active {
    background: rgba(54, 142, 255, 0.10);
    border-color: rgba(54, 142, 255, 0.55);
    box-shadow: 0 0 0 1px rgba(54, 142, 255, 0.10) inset, 0 12px 30px rgba(0, 0, 0, 0.25);
}

.pp-type-btn--active .pp-type-ic {
    background: rgba(54, 142, 255, 0.16);
    border-color: rgba(54, 142, 255, 0.35);
}

.pp-type-btn--active .pp-type-txt {
    color: rgba(200, 225, 255, 0.92);
}

.pp-box {
    position: relative;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 14px 14px 36px;
    min-height: unset;
}

.pp-input {
    width: 100%;
}

.pp-input :deep(.q-field__control),
.pp-input :deep(.q-field__native) {
    color: rgba(255, 255, 255, 0.92);
}

.pp-input-native {
    color: rgba(255, 255, 255, 0.92);
    font-size: 14px;
    line-height: 1.55;
    min-height: 120px;
    max-height: 240px;
    overflow-y: auto;
}

.pp-input :deep(textarea) {
    resize: none !important;
}

.pp-box-hint {
    position: absolute;
    right: 14px;
    bottom: 12px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.28);
}

.pp-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: calc(28px + env(safe-area-inset-bottom));
    padding: 0 18px;
    display: flex;
    justify-content: center;
}

.pp-bottom>.q-btn+.q-btn {
    margin-left: 12px;
}

.pp-photo-btn {
    width: 120px;
    height: 44px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.10);
    color: rgba(255, 255, 255, 0.88);
}

.pp-photo-btn :deep(.q-icon) {
    color: rgba(255, 255, 255, 0.85);
}

.pp-send-btn {
    flex: 1;
    max-width: 320px;
    height: 44px;
    border-radius: 14px;
    background: #2eff7b;
    color: #fff;
    font-weight: 800;
    letter-spacing: 0.2px;
    box-shadow: 0 16px 35px rgba(47, 255, 109, 0.22);
    padding-right: 10px;
}

.pp-send-btn-ic {
    margin-left: 6px;
    color: #fff;
}

@media (max-width: 360px) {
    .pp-wrap {
        padding: 10px 14px 0;
    }

    .pp-type-row {
        gap: 10px;
    }

    .pp-photo-btn {
        width: 110px;
    }
}

.pp-pics {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    overflow-x: auto;
    padding-bottom: 2px;
}

.pp-pic {
    position: relative;
    flex: 0 0 auto;
    width: 86px;
    height: 86px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: rgba(255, 255, 255, 0.04);
    overflow: hidden;
}

.pp-pic-img {
    width: 100%;
    height: 100%;
}

.pp-pic-del {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 26px;
    height: 26px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(0, 0, 0, 0.40);
    color: rgba(255, 255, 255, 0.92);
    display: grid;
    place-items: center;
    padding: 0;
}

.pp-file {
    display: none;
}
</style>