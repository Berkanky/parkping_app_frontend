<template>
    <q-page class="pp-page">
        <div class="pp-topbar">
            <q-btn flat round icon="arrow_back" class="pp-back" @click="go_back" />
            <div class="pp-title">Add Vehicle</div>
            <div class="pp-topbar-spacer"></div>
        </div>

        <div class="pp-content">
            <q-card flat bordered class="pp-card">
                <div class="pp-card-head">
                    <div class="pp-card-head-left">
                        <div class="pp-card-title">Vehicle Photos</div>
                    </div>
                    <div class="pp-card-meta">Max 3 photos</div>
                </div>

                <div class="pp-photos-row">
                    <div v-for="i in [0, 1, 2]" :key="i" class="pp-photo-slot"
                        :class="photos[i] ? 'pp-photo-filled' : 'pp-photo-add'" @click="pick_photo(i)" role="button"
                        tabindex="0">
                        <q-img v-if="photos[i]" :src="photos[i]" class="pp-photo-img" :ratio="1" fit="cover"
                            no-spinner />

                        <div v-else class="pp-photo-add-inner">
                            <q-icon name="add_a_photo" size="24px" class="pp-photo-add-icon" />
                            <div class="pp-photo-add-text">Add Photo</div>
                        </div>

                        <q-btn v-if="photos[i]" round unelevated icon="close" class="pp-photo-remove"
                            @click.stop="remove_photo(i)" />
                    </div>
                </div>
            </q-card>

            <q-card flat bordered class="pp-card pp-card-details">
                <div class="pp-section-title">Vehicle Details</div>

                <div class="pp-field">
                    <div class="pp-label">License Plate</div>
                    <q-input v-model="form.plate" outlined dense class="pp-input" placeholder="">
                        <template v-slot:prepend>
                            <q-icon name="badge" class="pp-input-icon" />
                        </template>
                    </q-input>
                    <div class="pp-help">This will be linked to your QR code.</div>
                </div>

                <div class="pp-field">
                    <div class="pp-label">Vehicle Type</div>
                    <div class="pp-type-row">
                        <button type="button" class="pp-type" :class="{ 'pp-type-active': form.vehicle_type === 'car' }"
                            @click="form.vehicle_type = 'car'">
                            <q-icon name="directions_car" size="26px" class="pp-type-icon" />
                            <div class="pp-type-text">Car</div>
                        </button>

                        <button type="button" class="pp-type"
                            :class="{ 'pp-type-active': form.vehicle_type === 'bike' }"
                            @click="form.vehicle_type = 'bike'">
                            <q-icon name="two_wheeler" size="26px" class="pp-type-icon" />
                            <div class="pp-type-text">Bike</div>
                        </button>

                        <button type="button" class="pp-type"
                            :class="{ 'pp-type-active': form.vehicle_type === 'truck' }"
                            @click="form.vehicle_type = 'truck'">
                            <q-icon name="local_shipping" size="26px" class="pp-type-icon" />
                            <div class="pp-type-text">Truck</div>
                        </button>
                    </div>
                </div>

                <div class="pp-grid-2">
                    <div class="pp-field">
                        <div class="pp-label">make</div>
                        <q-input v-model="form.make" outlined dense class="pp-input" placeholder="Toyota" />
                    </div>

                    <div class="pp-field">
                        <div class="pp-label">Model</div>
                        <q-input v-model="form.model" outlined dense class="pp-input" placeholder="Camry" />
                    </div>
                </div>

                <div class="pp-field">
                    <div class="pp-label">Color</div>

                    <div class="pp-color-row">
                        <button v-for="c in color_options" :key="c.key" type="button" class="pp-color-chip"
                            :class="{ 'pp-color-active': form.color_key === c.key }" @click="select_color(c)">
                            <span class="pp-color-dot" :style="{ background: c.dot }"></span>
                            <span class="pp-color-text">{{ c.label }}</span>
                        </button>

                        <button type="button" class="pp-color-chip pp-color-other"
                            :class="{ 'pp-color-active': form.color_key === 'other' }" @click="select_other_color">
                            <span class="pp-color-dot" style="background:#e5e7eb"></span>
                            <span class="pp-color-text">Other</span>
                        </button>
                    </div>

                    <q-input v-if="form.color_key === 'other'" v-model="form.color_custom" outlined dense
                        class="pp-input pp-color-custom" placeholder="e.g. Pearl White" />
                </div>
            </q-card>
        </div>
        <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="on_file_change" />
        <div class="pp-bottom-bar">
            <q-btn icon="done" class="pp-save-btn" unelevated no-caps label="Save Vehicle" @click="save_vehicle" />
        </div>
    </q-page>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
    setup() {
        var store = UseStore();
        return { store };
    },
    data() {
        return {
            current_user_id: null,
            photos: [
                null,
                null,
                null
            ],
            form: {
                make: 'Toyota',
                model: 'Camry',
                vehicle_type: 'car',
                plate: '',
                color_key: 'silver',
                color_label: 'Silver',
                color_custom: ''
            },
            photo_files: [null, null, null],
            selected_slot: null,
            color_options: [
                { key: 'black', label: 'Black', dot: '#111827' },
                { key: 'white', label: 'White', dot: '#f8fafc' },
                { key: 'silver', label: 'Silver', dot: '#cbd5e1' },
                { key: 'gray', label: 'Gray', dot: '#94a3b8' },
                { key: 'blue', label: 'Blue', dot: '#2563eb' },
                { key: 'red', label: 'Red', dot: '#dc2626' },
                { key: 'green', label: 'Green', dot: '#16a34a' },
                { key: 'yellow', label: 'Yellow', dot: '#facc15' }
            ],
        };
    },
    async mounted() {
        var { user_id } = this.$route.params;
        if (user_id) this.current_user_id = user_id;
    },
    methods: {
        select_color(c) {
            this.form.color_key = c.key;
            this.form.color_label = c.label;
            this.form.color_custom = '';
        },

        select_other_color() {
            this.form.color_key = 'other';
            this.form.color_label = '';
            this.$nextTick(() => { });
        },
        go_back() {
            if (this.$router) this.$router.back();
            else this.$router.push({ name: 'home' });
        },
        pick_photo(slot) {
            if (slot < 0 || slot > 2) return;
            this.selected_slot = slot;

            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
                this.$refs.fileInput.click();
            }
        },
        on_file_change(e) {
            var files = e.target.files;
            if (!files || !files.length) return;

            var file = files[0];
            if (!file) return;

            if (!file.type || !file.type.startsWith('image/')) {
                this.$q.notify({ type: 'negative', message: 'Only image files are allowed.' });
                return;
            }

            var maxMb = 6;
            var maxBytes = maxMb * 1024 * 1024;
            if (file.size > maxBytes) {
                this.$q.notify({ type: 'negative', message: `Image is too large. Max ${maxMb}MB.` });
                return;
            }

            var slot = this.selected_slot;
            if (slot === null || slot === undefined) return;

            if (this.photos[slot] && this.photos[slot].startsWith('blob:')) {
                URL.revokeObjectURL(this.photos[slot]);
            }

            this.photo_files[slot] = file;
            this.photos[slot] = URL.createObjectURL(file);
            this.selected_slot = null;
        },

        remove_photo(idx) {
            if (this.photos[idx] && typeof this.photos[idx] === 'string' && this.photos[idx].startsWith('blob:')) {
                URL.revokeObjectURL(this.photos[idx]);
            }
            this.photos[idx] = null;
            this.photo_files[idx] = null;
        },
        async save_vehicle() {
            var fd = new FormData();
            fd.append('plate', this.form.plate);
            fd.append('vehicle_type', this.form.vehicle_type);
            fd.append('make', this.form.make);
            fd.append('model', this.form.model);

            for (var i = 0; i < this.photo_files.length; i++) {
                if (this.photo_files[i]) fd.append('vehicle_pictures', this.photo_files[i]);
            };

            var final_color = this.form.color_key === 'other'
                ? (this.form.color_custom || '').trim()
                : this.form.color_label;

            fd.append('color', final_color);
            this.form.color = final_color;
            
            var res = await this.$api.post('/add-vehicle', fd);
            console.log("add_vehicle_service -> " + JSON.stringify(res));
            if( res.status !== 200 ) return;

            this.$router.push({ name:'home' });
        }
    }
};
</script>

<style scoped>
.pp-page {
    background: #f6f7fb;
    padding-bottom: calc(86px + env(safe-area-inset-bottom));
}

.pp-topbar {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px 0 10px;
}

.pp-back {
    width: 40px;
    height: 40px;
    border-radius: 14px;
}

.pp-title {
    font-size: 16px;
    font-weight: 900;
    color: #0b0f19;
}

.pp-topbar-spacer {
    width: 40px;
    height: 40px;
}

.pp-content {
    padding: 10px 14px 0 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.pp-card {
    border-radius: 18px;
    background: #fff;
    border: 1px solid rgba(17, 24, 39, .06);
    overflow: hidden;
    padding: 14px;
}

.pp-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.pp-card-title {
    font-size: 15px;
    font-weight: 900;
    color: #0b0f19;
}

.pp-card-meta {
    font-size: 12px;
    font-weight: 800;
    color: #94a3b8;
}

.pp-photos-row {
    margin-top: 12px;
    display: flex;
    gap: 12px;
}

.pp-photo-slot {
    width: 96px;
    height: 96px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    flex: 0 0 96px;
}

.pp-photo-filled {
    border: 1px solid rgba(17, 24, 39, .06);
    background: #eef2f7;
}

.pp-photo-img {
    width: 100%;
    height: 100%;
}

.pp-photo-remove {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: rgba(17, 24, 39, .85);
    color: #fff;
}

.pp-photo-add {
    border: 2px dashed rgba(148, 163, 184, .7);
    background: #fbfcff;
    padding: 0;
    cursor: pointer;
}

.pp-photo-add-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.pp-photo-add-icon {
    color: #94a3b8;
}

.pp-photo-add-text {
    font-size: 12px;
    font-weight: 800;
    color: #94a3b8;
}

.pp-manage {
    margin-top: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 0;
    background: transparent;
    padding: 8px 0 2px 0;
    cursor: pointer;
}

.pp-manage-icon {
    color: #2563eb;
}

.pp-manage-text {
    color: #2563eb;
    font-size: 13px;
    font-weight: 900;
}

.pp-section-title {
    font-size: 15px;
    font-weight: 900;
    color: #0b0f19;
    margin-bottom: 8px;
}

.pp-field {
    margin-top: 12px;
}

.pp-label {
    font-size: 12px;
    font-weight: 900;
    color: #475569;
    margin-bottom: 8px;
}

.pp-help {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #94a3b8;
}

.pp-input :deep(.q-field__control) {
    border-radius: 14px;
    background: #fff;
}

.pp-input :deep(.q-field__control:before) {
    border-color: rgba(148, 163, 184, .5);
}

.pp-input :deep(.q-field__control:hover:before) {
    border-color: rgba(148, 163, 184, .7);
}

.pp-input :deep(.q-field__native) {
    font-weight: 800;
    color: #0b0f19;
}

.pp-input-icon {
    color: #94a3b8;
}

.pp-type-row {
    display: flex;
    gap: 12px;
}

.pp-type {
    flex: 1;
    height: 72px;
    border-radius: 14px;
    border: 1.5px solid rgba(148, 163, 184, .5);
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
}

.pp-type-active {
    border-color: rgba(37, 99, 235, .85);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, .14);
}

.pp-type-icon {
    color: #0b0f19;
}

.pp-type-active .pp-type-icon {
    color: #2563eb;
}

.pp-type-text {
    font-size: 12px;
    font-weight: 900;
    color: #0b0f19;
}

.pp-type-active .pp-type-text {
    color: #2563eb;
}

.pp-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 6px;
}

.pp-color-dot {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: #cbd5e1;
    box-shadow: inset 0 0 0 2px rgba(17, 24, 39, .06);
}

.pp-palette {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    color: #94a3b8;
}

.pp-bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px 14px calc(12px + env(safe-area-inset-bottom)) 14px;
    background: rgba(246, 247, 251, .86);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(17, 24, 39, .08);
    z-index: 50;
}

.pp-save-btn {
    width: 100%;
    height: 54px;
    border-radius: 16px;
    background: black;
    color: #fff;
    font-weight: 900;
    letter-spacing: .2px;
}

.pp-color-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.pp-color-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 12px;
    border-radius: 14px;
    border: 1.5px solid rgba(148, 163, 184, .5);
    background: #fff;
    cursor: pointer;
    font-weight: 900;
    color: #0b0f19;
}

.pp-color-active {
    border-color: rgba(37, 99, 235, .85);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, .14);
}

.pp-color-dot {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    box-shadow: inset 0 0 0 2px rgba(17, 24, 39, .06);
}

.pp-color-text {
    font-size: 12px;
    font-weight: 900;
}

.pp-color-custom {
    margin-top: 10px;
}
</style>