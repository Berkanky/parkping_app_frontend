<template>
    <q-page class="pp-page">

        <div class="pp-header">
            <q-btn round flat class="pp-header-btn" icon="arrow_back" @click="go_back" />
            <div class="pp-header-title">Add Address</div>
            <div class="pp-header-spacer"></div>
        </div>

        <div class="pp-main">
            <div class="pp-card">

                <div class="pp-section">

                    <div class="pp-grid-2">
                        <div>
                            <div class="pp-label">Type</div>
                            <q-select 
                                :disable="this.is_action_update()"
                                v-model="type" :options="type_options" dense standout="pp-standout"
                                class="pp-field" emit-value map-options options-dense dropdown-icon="unfold_more"
                                popup-content-class="pp-popup" />

                        </div>

                        <div>
                            <div class="pp-label">Label</div>
                            <q-input v-model="label" dense standout="pp-standout" class="pp-field"
                                placeholder="e.g. My Apartment" input-class="pp-input-native" />
                        </div>
                    </div>

                    <div>
                        <div class="pp-label">Name Surname</div>
                        <q-input v-model="name_surname" dense standout="pp-standout" class="pp-field"
                            placeholder="John Doe" input-class="pp-input-native">
                            <template v-slot:prepend>
                                <q-icon class="pp-icon material-symbols-outlined" name="person" />
                            </template>
                        </q-input>
                    </div>

                </div>

                <div class="pp-section">
                    <div>
                        <div class="pp-label">Address Line 1</div>
                        <q-input v-model="line1" dense standout="pp-standout" class="pp-field"
                            placeholder="Street address, P.O. box" input-class="pp-input-native">
                            <template v-slot:prepend>
                                <q-icon class="pp-icon material-symbols-outlined" name="home" />
                            </template>
                        </q-input>
                    </div>

                    <div>
                        <div class="pp-label">Address Line 2 (Optional)</div>
                        <q-input v-model="line2" dense standout="pp-standout" class="pp-field"
                            placeholder="Apartment, suite, unit, building, floor" input-class="pp-input-native" />
                    </div>

                    <div class="pp-grid-2">
                        <div>
                            <div class="pp-label">District</div>
                            <q-input v-model="district" dense standout="pp-standout" class="pp-field"
                                placeholder="Neighborhood" input-class="pp-input-native" />
                        </div>

                        <div>
                            <div class="pp-label">City</div>
                            <q-input v-model="city" dense standout="pp-standout" class="pp-field" placeholder="City"
                                input-class="pp-input-native">
                                <template v-slot:prepend>
                                    <q-icon class="pp-icon material-symbols-outlined" name="location_city" />
                                </template>
                            </q-input>
                        </div>
                    </div>

                    <div class="pp-grid-2">
                        <!-- <div>
                            <div class="pp-label">State (Optional)</div>
                            <q-input v-model="state" dense standout="pp-standout" class="pp-field"
                                placeholder="State/Province" input-class="pp-input-native" />
                        </div> -->

                        <div>
                            <div class="pp-label">Postal Code</div>
                            <q-input v-model="postal_code" dense standout="pp-standout" class="pp-field"
                                placeholder="12345" input-class="pp-input-native" />
                        </div>
                    </div>

                    <div>
                        <div class="pp-label">Country Code</div>
                        <q-input v-model="country_code" dense standout="pp-standout" class="pp-field" placeholder="US"
                            input-class="pp-input-native" />
                    </div>
                </div>

            </div>
        </div>

        <div class="pp-bottom">
            <div class="pp-bottom-wrap">
                <q-btn class="pp-save" unelevated no-caps label="Save Address" @click="on_save" />
                <q-btn class="pp-cancel" flat no-caps label="Cancel" @click="go_back" />
            </div>
        </div>

        <div class="pp-top-glow"></div>
    </q-page>
</template>

<script>
import { UseStore } from '../stores/store';

export default {
    setup() {
        var store = UseStore();
        return { store };
    },
    data: function () {
        return {
            type_options: [
                { label: 'Home', value: 'home' },
                { label: 'Work', value: 'work' }
            ],
            type: '',
            label: '',
            name_surname: '',
            line1: '',
            line2: '',
            district: '',
            city: '',
            state: '',
            postal_code: '',
            country_code: '',
            action_type: '',
            address_id: ''
        };
    },
    async created(){
        var { address_id } = this.$route.query;
        if( address_id ) {

            this.address_id = address_id;
            this.action_type = 'update';
            await this.get_address_details_service(address_id);
        }
    },
    methods: {
        async get_address_details_service(address_id){
            var res = await this.$api.get('/selected-address-detail/' + address_id);
            if( res.status !== 200 ) return this.go_back();

            var { type, label, name_surname, line1, line2, district, city, state, postal_code, country_code  } = res.data.address_detail;

            this.type = type;
            this.label = label;
            this.name_surname = name_surname;
            this.line1 = line1;
            this.line2 = line2;
            this.district = district;
            this.city = city;
            this.state = state;
            this.postal_code = postal_code;
            this.country_code = country_code;
        },
        is_action_update(){
            return this.action_type == 'update' ? true : false;
        },
        go_back() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.replace({ name: 'home' });
            }
        },
        async on_save() {

            var req_body = {
                type: this.type || '',
                label: this.label || '',
                name_surname: this.name_surname || '',
                line1: this.line1 || '',
                line2: this.line2 || '',
                district: this.district || '',
                city: this.city || '',
                postal_code: this.postal_code || '',
                country_code: this.country_code || '',
                address_id: this.address_id || ''
            };

            var res = await this.$api.post('/create-address', req_body);
            if (res.status !== 200) return;

            this.go_back();
        }
    }
};
</script>

<style>
.pp-page {
    background: #1C1C22;
    color: #fff;
    min-height: 100dvh;
}

.pp-header {
    position: sticky;
    top: 0;
    z-index: 50;
    height: 72px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(28, 28, 34, 0.82);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.pp-header-btn {
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    background: #1c1e26;
    border: 1px solid rgba(255, 255, 255, 0.06);
}

.pp-header-title {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
}

.pp-header-spacer {
    width: 44px;
    height: 44px;
}

.pp-main {
    max-width: 520px;
    margin: 0 auto;
    padding: 14px 18px 140px;
}

.pp-card {
    background: #1c1e26;
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.pp-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.pp-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

.pp-label {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 800;
    letter-spacing: 0.18em;
    color: rgba(255, 255, 255, 0.35);
    margin-left: 6px;
    margin-bottom: 8px;
}

.pp-field .q-field__control {
    height: 56px;
    border-radius: 14px;
    background: #25272e !important;
}

.pp-field .q-field__control:before,
.pp-field .q-field__control:after {
    display: none;
}

.pp-field.q-field--focused .q-field__control {
    box-shadow: 0 0 0 1px #2eff7b;
}

.pp-input-native {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
}

.pp-field .q-field__native,
.pp-field .q-field__input {
    color: #fff;
}

.pp-field .q-field__native::placeholder,
.pp-field input::placeholder {
    color: rgba(255, 255, 255, 0.45);
}

.pp-icon {
    color: rgba(255, 255, 255, 0.45);
    font-size: 20px;
}

.pp-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 18px;
    z-index: 60;
    background: linear-gradient(to top, rgba(28, 28, 34, 1), rgba(28, 28, 34, 1), rgba(28, 28, 34, 0));
}

.pp-bottom-wrap {
    max-width: 520px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.pp-save {
    height: 25px;
    border-radius: 14px;
    background: #2eff7b;
    color: #000;
    font-weight: 900;
    font-size: 16px;
    box-shadow: 0 14px 30px rgba(46, 255, 123, 0.18);
    transition: transform 0.15s ease;
}

.pp-save:active {
    transform: scale(0.98);
}

.pp-cancel {
    height: 25px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    color: rgba(255, 255, 255, 0.55);
    font-weight: 800;
}

.pp-top-glow {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: min(520px, 100%);
    height: 4px;
    background: linear-gradient(to right, transparent, rgba(46, 255, 123, 0.55), transparent);
    filter: blur(12px);
    pointer-events: none;
    z-index: 70;
}

@media (max-width: 420px) {
    .pp-grid-2 {
        grid-template-columns: 1fr;
    }
}
</style>