<template>
    <q-page class="pp-page">
        <div class="pp-topbar text-white">
            <q-btn flat round icon="chevron_left" class="pp-back" @click="go_back" />
            <div class="pp-title">Add Vehicle</div>
            <div class="pp-topbar-spacer"></div>
        </div>
        <div class="pp-content text-white">
            <q-card flat bordered class="pp-card pp-card-details">
                <div class="pp-plate-head">
                    <div class="pp-section-title">Plate</div>
                </div>
                <div class="pp-field" style="margin-top:10px">
                    <q-input v-model="form.plate" outlined dense class="pp-input" placeholder="34ABC123">
                        <template v-slot:prepend>
                            <q-icon name="badge" class="pp-input-icon" />
                        </template>
                    </q-input>
                </div>
            </q-card>
            <q-card flat bordered class="pp-card pp-card-details">
                <div class="pp-plate-head">
                    <div class="pp-section-title">Vehicle Status Notification</div>
                </div>
                <div class="pp-field" style="margin-top:10px">
                    <q-input type="textarea" v-model="form.vehicle_status_notification" outlined dense class="pp-input" placeholder="vehicle status">
                        <template v-slot:prepend>
                            <q-icon name="info" class="pp-input-icon" />
                        </template>
                    </q-input>
                </div>
            </q-card>
            <q-card flat bordered class="pp-card" v-if="(vehicle_existing_pictures || []).length">
                <div class="pp-card-head">
                    <div class="pp-card-head-left">
                        <div class="pp-card-title">Existing Vehicle Photos</div>
                    </div>
                </div>
                <div class="pp-photos-row">
                    <div v-for="i in vehicle_existing_pictures" :key="i._id" class="pp-photo-slot pp-photo-filled">
                        <q-img :src="get_vehicle_picture(i._id)" class="pp-photo-img" :ratio="1" fit="cover"
                            no-spinner />
                        <q-btn v-if="!i.is_deleted" round unelevated dense size="10px" icon="close"
                            class="pp-photo-remove" @click.stop="update_photo_status(i._id)" />

                        <div class="absolute-center bg-dark flex flex-center" v-if="i.is_deleted">
                            <q-btn icon="sync" flat size="sm" v-on:click="update_photo_status(i._id)"></q-btn>
                        </div>
                    </div>
                </div>
            </q-card>
            <q-card flat bordered class="pp-card">
                <div class=" pp-card-head">
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
                            <div class="pp-photo-add-iconwrap">
                                <q-icon name="photo_camera" size="30px" class="pp-photo-add-icon" />
                                <div class="pp-photo-add-plus">+</div>
                            </div>
                            <div class="pp-photo-add-text">Add Photo</div>
                        </div>
                        <q-btn v-if="photos[i]" round unelevated dense size="10px" icon="close" class="pp-photo-remove"
                            @click.stop="remove_photo(i)" />
                    </div>
                </div>
            </q-card>
            <q-card flat bordered class="pp-card pp-card-details">
                <div class="pp-section-title">Vehicle Details</div>
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
                        <div class="pp-label">Make</div>
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
                        <button v-for="c in color_options" :key="c.key" type="button" class="pp-color-chip text-white"
                            :class="{ 'pp-color-active': form.color_key === c.key }" @click="select_color(c)">
                            <span class="pp-color-dot" :style="{ background: c.dot }"></span>
                            <span class="pp-color-text">{{ c.label }}</span>
                        </button>
                        <button type="button" class="pp-color-chip text-white"
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
            <q-btn :label="dynamic_label()" :icon="dynamic_icon()" class="pp-save-btn bg-white text-dark" unelevated
                no-caps @click="save_vehicle" />
        </div>
    </q-page>
</template>

<script>
import { tiSave } from '@quasar/extras/themify';
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
                color_custom: '',
                vehicle_status_notification: ''
            },
            vehicle_pictures: [null, null, null],
            selected_slot: null,
            color_options: [
                { key: 'black', label: 'black', dot: '#111827' },
                { key: 'white', label: 'white', dot: '#f8fafc' },
                { key: 'silver', label: 'silver', dot: '#cbd5e1' },
                { key: 'gray', label: 'gray', dot: '#94a3b8' },
                { key: 'blue', label: 'blue', dot: '#2563eb' },
                { key: 'red', label: 'red', dot: '#dc2626' },
                { key: 'green', label: 'green', dot: '#16a34a' },
                { key: 'yellow', label: 'yellow', dot: '#facc15' }
            ],
            plate_state: 'idle', // idle | checking | found | not_found
            editing_vehicle_id: null,
            plate_debounce_ms: 650,
            plate_timer: null,
            last_checked_plate: '',
            vehicle_existing_pictures: [],
            action_type: null
        };
    },
    async mounted() {
        var { action_type, vehicle_id } = this.$route.query;
        var { user_id } = this.$route.params;

        this.current_user_id = user_id;
        this.action_type = action_type;

        if (action_type == 'update') await this.get_existing_vehicle_data(vehicle_id);
    },
    methods: {
        dynamic_icon() {
            if (this.action_type == 'update') return 'update';
            else if (this.action_type == 'create') return 'add';
            else return 'check';
        },
        dynamic_label() {
            if (this.action_type == 'update') return 'Save Vehicle';
            else if (this.action_type == 'create') return 'Add Vehicle';
            else return '-';
        },
        update_photo_status(_id) {
            var existing_picture = this.vehicle_existing_pictures.find(function (item) { return item._id === _id });
            if (existing_picture) {
                if ('is_deleted' in existing_picture && existing_picture.is_deleted === true) existing_picture.is_deleted = false;
                else existing_picture.is_deleted = true;
            }
            else return;
        },
        async delete_photo(i) {
            var file_id = i._id;
            var res = await this.$api.post('/delete-picture', { file_id: file_id });
            if (res.status !== 204) return;

            this.vehicle_existing_pictures = this.vehicle_existing_pictures.filter(function (item) { return item._id !== i._id });
        },
        on_plate_input(val) {
            var p = val;
            if (!p || p.length < 4) {

                this.plate_state = 'idle';
                this.editing_vehicle_id = null;
                this.last_checked_plate = '';
                if (this.plate_timer) clearTimeout(this.plate_timer);
                return;
            }

            if (this.plate_timer) clearTimeout(this.plate_timer);

            this.plate_timer = setTimeout(() => {
                this.check_plate_and_load(p, { force: false });
            }, this.plate_debounce_ms);
        },
        on_plate_blur() {
            var p = this.form.plate;
            if (!p || p.length < 4) return;

            this.check_plate_and_load(p, { force: true });
        },
        async check_plate_and_load(plate, opts) {
            opts = opts || {};
            var force = !!opts.force;
            if (!force && plate === this.last_checked_plate) return;

            this.plate_state = 'checking';

            try {
                var res = await this.$api.post('/plate-control', { plate: plate });

                if (res.status !== 200) {
                    this.plate_state = 'idle';
                    return;
                }

                this.last_checked_plate = plate;

                if (res.status === 200) {
                    this.apply_vehicle_to_form(res.data.vehicle_detail);
                    this.plate_state = 'found';
                }
                else {
                    this.reset_form_keep_plate(plate);
                    this.plate_state = 'not_found';
                }
            } catch (e) {
                this.plate_state = 'idle';
            }
        },
        async get_existing_vehicle_data(vehicle_id) {
            try {
                var res = await this.$api.post('/vehicle-detail', { vehicle_id: vehicle_id });
                if (res.status !== 200) this.$router.replace({ path: '/home' });

                var existing_vehicle_detail = res.data.vehicle_detail;
                this.apply_vehicle_to_form(existing_vehicle_detail);
            } catch (err) {
                console.error(err);
            }
        },
        apply_vehicle_to_form(v) {
            this.editing_vehicle_id = v._id || null;

            this.form.plate = v.plate || '';
            this.form.make = v.make || '';
            this.form.model = v.model || '';
            this.form.vehicle_type = v.vehicle_type || 'car';
            this.form.color = v.color || null;
            this.form.vehicle_status_notification = v.vehicle_status_notification || null;

            this.vehicle_existing_pictures = Array.isArray(v.vehicle_pictures) ? v.vehicle_pictures : [];

            var existing_color = this.color_options.find(function (item) { return item.label === v.color })
            if (existing_color) {

                this.form.color_key = v.color;
                this.form.color_label = v.color;
                this.form.color_custom = null;
            } else {

                this.form.color_custom = v.color;
            }
        },
        reset_form_keep_plate(plate) {
            this.editing_vehicle_id = null;

            this.form.make = '';
            this.form.model = '';
            this.form.vehicle_type = 'car';

            this.form.color_key = 'silver';
            this.form.color_label = 'Silver';
            this.form.color_custom = '';

            this.vehicle_existing_pictures = [];

            for (var i = 0; i < this.photos.length; i++) {
                if (this.photos[i] && typeof this.photos[i] === 'string' && this.photos[i].startsWith('blob:')) {
                    URL.revokeObjectURL(this.photos[i]);
                }
                this.photos[i] = null;
                this.vehicle_pictures[i] = null;
            }

            this.form.plate = plate;
        },
        find_color_key_by_label(label) {
            if (!label) return null;
            var l = String(label).trim().toLocaleLowerCase('tr-TR');
            var row = (this.color_options || []).find(x => String(x.label).toLocaleLowerCase('tr-TR') === l);
            return row ? row.key : null;
        },
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
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.replace({ name: 'home' });
            }
        },
        pick_photo(slot) {
            if (slot < 0 || slot > 2) return;
            this.selected_slot = slot;

            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
                this.$refs.fileInput.click();
            }
        },
        /* on_file_change(e) {
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

            this.vehicle_pictures[slot] = file;
            this.photos[slot] = URL.createObjectURL(file);
            this.selected_slot = null;
        }, */
        on_file_change(e) {

            var input = e.target;
            var files = input.files;
            if (!files || !files.length) return;

            var file = files[0];
            if (!file) return;

            var name = (file.name || '').toLowerCase();
            var ext = name.split('.').pop();

            var looksLikeImage =
                (file.type && file.type.startsWith('image/')) ||
                ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(ext);

            if (!looksLikeImage) {
                this.$q.notify({ type: 'negative', message: 'Only image files are allowed.' });
                input.value = '';
                return;
            }

            var maxMb = 6;
            var maxBytes = maxMb * 1024 * 1024;
            if (file.size > maxBytes) {
                this.$q.notify({ type: 'negative', message: `Image is too large. Max ${maxMb}MB.` });
                input.value = '';
                return;
            }

            var slot = this.selected_slot;
            if (slot === null || slot === undefined) {
                input.value = '';
                return;
            }

            if (this.photos[slot] && this.photos[slot].startsWith('blob:')) {
                URL.revokeObjectURL(this.photos[slot]);
            }

            this.vehicle_pictures[slot] = file;

            try {
                const url = URL.createObjectURL(file);
                this.photos[slot] = url;

            } catch (err) {
                var reader = new FileReader();
                reader.onload = () => {
                    this.photos[slot] = reader.result;
                };
                reader.readAsDataURL(file);
            }

            this.selected_slot = null;
            input.value = '';
        },
        remove_photo(idx) {
            if (this.photos[idx] && typeof this.photos[idx] === 'string' && this.photos[idx].startsWith('blob:')) {
                URL.revokeObjectURL(this.photos[idx]);
            }
            this.photos[idx] = null;
            this.vehicle_pictures[idx] = null;
        },
        async save_vehicle() {

            var fd = new FormData();

            fd.append('plate', this.form.plate);
            fd.append('vehicle_type', this.form.vehicle_type);
            fd.append('make', this.form.make);
            fd.append('model', this.form.model);
            fd.append('action_type', this.action_type);
            fd.append('vehicle_status_notification', this.form.vehicle_status_notification);

            var deleted_pictures = this.vehicle_existing_pictures.filter(function (item) { return item.is_deleted === true });
            deleted_pictures = deleted_pictures.map(function (item) { return item._id });
            if (deleted_pictures) fd.append('deleted_pictures', JSON.stringify(deleted_pictures));

            for (var i = 0; i < this.vehicle_pictures.length; i++) {
                if (this.vehicle_pictures[i]) fd.append('vehicle_pictures', this.vehicle_pictures[i]);
            };

            var final_color = this.form.color_key === 'other'
                ? (this.form.color_custom || '').trim()
                : this.form.color_label;

            fd.append('color', final_color);
            this.form.color = final_color;

            var res = await this.$api.post('/add-vehicle', fd);
            if (res.status !== 200) return;

            this.$router.push({ name: 'home' });
        },
        get_vehicle_picture(_id) {
            var backend_url = import.meta.env.VITE_BACKEND_URL;
            return backend_url + '/picture/' + _id;
        }
    }
};
</script>

<style scoped>
.pp-page {
    background: #1c1c22;
    padding-bottom: calc(86px + env(safe-area-inset-bottom));
}

.pp-topbar {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px 0 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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

.pp-content {
    padding: 10px 14px 0 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.pp-card {
    border-radius: 18px;
    background: #24242b;
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
}

.pp-card-meta {
    font-size: 12px;
    font-weight: 800;
}

.pp-photos-row {
    margin-top: 12px;
    display: flex;
    gap: 12px;

    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;

    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    padding-bottom: 4px;
}

.pp-photo-slot {
    flex: 0 0 96px;
    scroll-snap-align: start;
    width: 96px;
    height: 96px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
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
    top: 6px;
    right: 6px;
    width: 22px;
    height: 22px;
    min-width: 22px;
    min-height: 22px;
    padding: 0;
    border-radius: 999px;
    background: rgba(17, 24, 39, .78);
}

.pp-photo-remove :deep(.q-icon) {
    font-size: 14px;
}

.pp-photo-remove:active {
    transform: scale(.96);
}

.pp-photo-add {
    border: 2px dashed rgba(255, 255, 255, .22);
    background: #1f1f26;
    cursor: pointer;
}

.pp-photo-add-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: rgba(255, 255, 255, .55);
}

.pp-photo-add-iconwrap {
    position: relative;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 12px;
}

.pp-photo-add-icon {
    color: rgba(255, 255, 255, .45);
}

.pp-photo-add-plus {
    position: absolute;
    right: -3px;
    top: -3px;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: rgba(255, 255, 255, .10);
    border: 1px solid rgba(255, 255, 255, .18);
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    color: rgba(255, 255, 255, .65);
}

.pp-photo-add:active {
    transform: scale(.98);
}

.pp-photo-add:hover {
    border-color: rgba(255, 255, 255, .32);
}

.pp-photo-add-text {
    font-size: 12px;
    font-weight: 800;
    color: rgba(255, 255, 255, .55);
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

.pp-manage-icon {}

.pp-manage-text {
    font-size: 13px;
    font-weight: 900;
}

.pp-section-title {
    font-size: 15px;
    font-weight: 900;
    margin-bottom: 8px;
}

.pp-field {
    margin-top: 12px;
}

.pp-label {
    font-size: 12px;
    font-weight: 900;
    margin-bottom: 8px;
}

.pp-help {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 700;
}

.pp-input :deep(.q-field__control) {
    border-radius: 14px;
    background: #1e1e1e;
    color: white;
}

.pp-input :deep(.q-field__control:before) {
    border-color: #24242b;
}

.pp-input :deep(.q-field__control:hover:before) {
    border-color: #24242b;
}

.pp-input :deep(.q-field__native) {
    font-weight: 800;
    color: white;
}

.pp-input-icon {
    color: white;
}

.pp-type-row {
    display: flex;
    gap: 12px;
}

.pp-type {
    flex: 1;
    height: 72px;
    border-radius: 14px;
    border: 1px solid rgb(134, 134, 134);
    background: #24242b;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.pp-type-active {
    border-color: #2eff7b;
}

.pp-type-icon {
    color: #5e5e5e;
}

.pp-type-active .pp-type-icon {
    color: #2eff7b;
    border-color: #2eff7b;
}

.pp-type-text {
    font-size: 12px;
    font-weight: 900;
    color: #5e5e5e;
}

.pp-type-active .pp-type-text {
    color: #2eff7b;
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
}

.pp-bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px 14px calc(12px + env(safe-area-inset-bottom)) 14px;
    background: #1C1C22;
    backdrop-filter: blur(10px);
    z-index: 50;
}

.pp-save-btn {
    width: 100%;
    height: 34px;
    border-radius: 18px;
    font-weight: 850;
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
    border: 1px solid #24242b;
    background: #1e1e1e;
    cursor: pointer;
    font-weight: 900;
}

.pp-color-active {
    border-color: #2eff7b;
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