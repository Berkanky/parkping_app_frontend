<template>
    <q-page class="pp-page">
        <div class="pp-shell">

            <div class="pp-header">
                <q-btn round flat class="pp-head-btn" @click="go_back">
                    <q-icon name="arrow_back" size="20px" />
                </q-btn>
            </div>

            <div class="pp-content">

                <div class="pp-card pp-profile-card">
                    <div class="pp-avatar-wrap">
                        <div class="pp-avatar-ring">
                            <q-avatar size="112px" class="pp-avatar">
                                <img :src="user_details.profile_picture" />
                            </q-avatar>
                        </div>

                        <div class="pp-qr-badge">
                            <q-icon name="qr_code_2" size="18px" color="dark" />
                        </div>
                    </div>

                    <div class="pp-name">
                        {{ ((user_details.name || '') + ' ' + (user_details.surname || '')).trim() }}
                    </div>

                    <div class="pp-contact">
                        <div v-if="!user_details.hide_email_address" class="pp-contact-row">
                            <q-icon name="mail" size="16px" class="pp-contact-ic" />
                            <span class="pp-contact-txt">{{ user_details.email_address || '-' }}</span>
                        </div>

                        <div v-if="!user_details.hide_phone_number" class="pp-contact-row">
                            <q-icon name="smartphone" size="16px" class="pp-contact-ic" />
                            <span class="pp-contact-txt">{{ user_details.phone_number_encrypted || '-' }}</span>
                        </div>
                    </div>

                    <div class="pp-stats">
                        <div class="pp-stat">
                            <div class="pp-stat-k">Register Date</div>
                            <div class="pp-stat-v">{{ user_details.created_date || '-' }}</div>
                        </div>

                        <div class="pp-stat">
                            <div class="pp-stat-k">Vehicles</div>
                            <div class="pp-stat-v pp-green">{{ (user_details.vehicle_count ?? '-') }} Aktif</div>
                        </div>

                        <div class="pp-stat pp-stat-wide">
                            <div class="pp-stat-k">Last Update</div>
                            <div class="pp-stat-v">{{ user_details.updated_date || '-' }}</div>
                        </div>
                    </div>
                </div>

                <div class="pp-card">
                    <div class="pp-sec-head">
                        <div class="pp-sec-ic">
                            <q-icon name="edit_note" size="20px" class="pp-sec-ic-i" />
                        </div>
                        <div class="pp-sec-title">Update Profile</div>
                    </div>

                    <div class="pp-form">
                        <div class="pp-field">
                            <div class="pp-label">Name</div>
                            <div class="pp-input-wrap">
                                <q-input dense borderless v-model="form.name" class="pp-input"
                                    input-class="pp-input-native" />
                                <q-icon name="person" size="18px" class="pp-input-ic" />
                            </div>
                        </div>

                        <div class="pp-field">
                            <div class="pp-label">Surname</div>
                            <div class="pp-input-wrap">
                                <q-input dense borderless v-model="form.surname" class="pp-input"
                                    input-class="pp-input-native" />
                                <q-icon name="person" size="18px" class="pp-input-ic" />
                            </div>
                        </div>

                        <div class="pp-field">
                            <div class="pp-label">Phone</div>
                            <div class="pp-input-wrap">
                                <q-input dense borderless v-model="form.phone" class="pp-input"
                                    input-class="pp-input-native" />
                                <q-icon name="call" size="18px" class="pp-input-ic" />
                            </div>
                        </div>

                        <div class="pp-field">
                            <div class="pp-label">Dial Code</div>
                            <div class="pp-input-wrap">
                                <q-input dense borderless v-model="form.dial_code" class="pp-input"
                                    input-class="pp-input-native" />
                                <q-icon name="call" size="18px" class="pp-input-ic" />
                            </div>
                        </div>

                        <div class="pp-field">
                            <div class="pp-label">Email</div>
                            <div class="pp-input-wrap">
                                <q-input disable dense borderless v-model="form.email_address" class="pp-input"
                                    input-class="pp-input-native" type="email" />
                                <q-icon name="mail" size="18px" class="pp-input-ic" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pp-card">
                    <div class="pp-sec-head">
                        <div class="pp-sec-ic">
                            <q-icon name="lock" size="20px" class="pp-sec-ic-i" />
                        </div>
                        <div class="pp-sec-title">Privacy Settings</div>
                    </div>

                    <div class="pp-toggles">
                        <div class="pp-toggle-row">
                            <div class="pp-toggle-txt">
                                <div class="pp-toggle-title">Hide Profile</div>
                                <div class="pp-toggle-sub">Your profile does not appear in search results.</div>
                            </div>
                            <q-toggle v-model="toggles.hide_profile" color="ppgreen" keep-color class="pp-toggle" />
                        </div>

                        <div class="pp-divider"></div>

                        <div class="pp-toggle-row">
                            <div class="pp-toggle-txt">
                                <div class="pp-toggle-title">Hide Phone</div>
                                <div class="pp-toggle-sub">Your number cannot be seen by others.</div>
                            </div>
                            <q-toggle v-model="toggles.hide_phone_number" color="ppgreen" keep-color
                                class="pp-toggle" />
                        </div>

                        <div class="pp-divider"></div>

                        <div class="pp-toggle-row">
                            <div class="pp-toggle-txt">
                                <div class="pp-toggle-title">Allow Messages</div>
                                <div class="pp-toggle-sub">Other users can reach you via QR or Public Code.</div>
                            </div>
                            <q-toggle v-model="toggles.allow_message" color="ppgreen" keep-color class="pp-toggle" />
                        </div>
                    </div>

                </div>

                <q-btn unelevated no-caps class="pp-save-btn" label="Save Changes" @click="on_save" />

                <div class="pp-addr-head">
                    <div class="pp-addr-title">My addresses</div>
                    <q-btn rounded unelevated no-caps class="pp-addr-add" @click="on_add_address">
                        <q-icon name="add" size="18px" class="pp-addr-add-ic" />
                        <span>Add</span>
                    </q-btn>
                </div>

                <div v-for="(addr, idx) in addresses_view" :key="idx" class="pp-card pp-addr-card">
                    <div class="pp-addr-top">
                        <div class="pp-addr-left">
                            <div class="pp-addr-ic" :class="{ 'pp-addr-ic-muted': addr.iconMuted }">
                                <q-icon :name="addr.icon" size="20px" />
                            </div>
                            <div class="pp-addr-meta">
                                <div class="pp-addr-name" :class="{ 'pp-muted': addr.mutedTitle }">{{ addr.title }}
                                </div>
                                <div v-if="addr.badge" class="pp-addr-badge">{{ addr.badge }}</div>
                            </div>
                        </div>

                        <q-btn round flat dense class="pp-more-btn" @click="go_edit_current_address(addr._id)">
                            <q-icon name="edit" size="18px" />
                        </q-btn>
                    </div>

                    <div class="pp-addr-body">
                        <div class="pp-addr-line">
                            <div class="pp-addr-pipe"></div>
                            <div class="pp-addr-lines">
                                <div class="pp-addr-l1">{{ addr.person }}</div>
                                <div class="pp-addr-l2">{{ addr.phone }}</div>
                                <div class="pp-addr-l3">{{ addr.city }}</div>
                                <div class="pp-addr-l4">{{ addr.detail }}</div>
                            </div>
                        </div>

                        <div v-if="addr.meta" class="pp-addr-foot">
                            <span>{{ addr.meta.created }}</span>
                            <span class="pp-dot"></span>
                            <span>{{ addr.meta.updated }}</span>
                        </div>
                    </div>

                    <div v-if="addr.decor" class="pp-addr-decor"></div>
                </div>

                <div class="pp-danger">
                    <div class="pp-danger-head">
                        <div class="pp-danger-ic">
                            <q-icon name="warning" size="20px" />
                        </div>
                        <div class="pp-danger-title">Manage Account</div>
                    </div>

                    <div class="pp-danger-text">
                        This action cannot be undone. To delete your account, enter the following field: <b>"DELETE
                            ACCOUNT"</b> write.
                    </div>

                    <div class="pp-danger-actions">
                        <q-input dense borderless v-model="delete_confirm" class="pp-danger-input"
                            input-class="pp-danger-input-native" placeholder="Confirmation Code" />
                        <q-btn unelevated no-caps class="pp-danger-btn" @click="on_delete_account">
                            <q-icon name="delete_forever" size="20px" class="pp-danger-btn-ic" />
                            <span>Permanently Delete Account</span>
                        </q-btn>
                    </div>
                </div>

                <div class="pp-bottom-spacer"></div>
            </div>
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
    data: function () {
        return {
            user_details: {},
            form: {
                name: '',
                surname: '',
                phone: '',
                email_address: '',
                dial_code: ''
            },
            toggles: {
                hide_profile: false,
                hide_phone_number: false,
                allow_message: true
            },
            delete_confirm: ''
        };
    },
    computed: {
        addresses_view: function () {
            var addrs = (this.user_details && this.user_details.addresses) ? this.user_details.addresses : [];
            if (!Array.isArray(addrs)) return [];

            var phone = this.user_details ? (this.user_details.phone_number_encrypted || '-') : '-';

            return addrs
                .filter(function (a) { return a && a.is_deleted !== true; })
                .map(function (a, i) {
                    var t = (a.type || '').toString().toLowerCase();
                    var l = (a.label || '').toString().toLowerCase();

                    var isHome = t === 'home' || l === 'home';
                    var isWork = t === 'work' || l === 'work' || t === 'office' || l === 'office';

                    var icon = isHome ? 'home' : (isWork ? 'work' : 'location_on');

                    var rawTitle = (a.label || a.type || 'address').toString();
                    var title =
                        rawTitle.toLowerCase() === 'home' ? 'Home Address' :
                            rawTitle.toLowerCase() === 'work' ? 'Office' :
                                rawTitle.toLowerCase() === 'office' ? 'Office' :
                                    rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

                    var person = a.name_surname || '-';

                    var cityLineParts = [];
                    if (a.country_code) cityLineParts.push((a.country_code || '').toString().toUpperCase());
                    if (a.city) cityLineParts.push(a.city);
                    if (a.district) cityLineParts.push(a.district);
                    if (a.state) cityLineParts.push(a.state);

                    var cityLine = cityLineParts.join(', ') || '-';

                    var detailParts = [];
                    if (a.line1) detailParts.push(a.line1);
                    if (a.line2) detailParts.push(a.line2);

                    var postal = (a.postal_code === 0 || a.postal_code) ? String(a.postal_code) : '';
                    if (postal) detailParts.push('(' + postal + ')');

                    var detail = detailParts.join(' ') || '-';

                    return {
                        _id: a._id,
                        decor: i === 0,
                        icon: icon,
                        iconMuted: !isHome,
                        mutedTitle: !isHome,
                        title: title,
                        badge: isHome ? 'Primary Address' : '',
                        person: person,
                        phone: phone,
                        city: cityLine,
                        detail: detail,
                        meta: {
                            created: a.created_date || '-',
                            updated: a.updated_date || '-'
                        }
                    };
                });
        }
    },
    async mounted() {
        await this.store.get_user_details();
    },
    methods: {
        go_back() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.replace({ name: 'home' });
            }
        },
        async on_save() {
            await this.update_profile_service();
        },
        on_add_address() {
            this.$router.push({ name: 'add-address' });
        },
        go_edit_current_address(_id) {

            this.$router.push({ name: 'add-address', query:{ address_id: _id } });
        },
        on_delete_account() { },
        async update_profile_service() {

            var req_body = {
                name: this.form?.name || '',
                surname: this.form?.surname || '',
                dial_code: this.form?.dial_code || '',
                phone_number: this.form?.phone || '',
                hide_profile: this.toggles.hide_profile,
                hide_phone_number: this.toggles.hide_phone_number,
                allow_message: this.toggles.allow_message,
            };

            var res = await this.$api.post('/update-profile', req_body);
            if (res.status !== 200) return;

            await this.store.get_user_details();
        }
    },
    watch: {
        'store.user_data': {
            handler(newVal) {
                if (newVal) {
                    this.user_details = newVal;

                    this.form.name = newVal.name || '-';
                    this.form.surname = newVal.surname || '-';
                    this.form.phone = newVal.phone_number_encrypted || '-';
                    this.form.dial_code = newVal.dial_code || '-';
                    this.form.email_address = newVal.email_address || '-';

                    this.toggles.hide_profile = !!newVal.hide_profile;
                    this.toggles.hide_phone_number = !!newVal.hide_phone_number;
                    this.toggles.allow_message = !!newVal.allow_message;
                }
            },
            immediate: true,
            deep: true
        }
    }
};
</script>

<style scoped>
    .pp-page {
  background: #1c1c22;
  color: #fff;
}

.pp-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-bottom: 48px;
}

.pp-header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;
  background: rgba(28, 28, 34, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.pp-head-btn {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: #1c1e26;
}

.pp-head-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.pp-head-spacer {
  width: 40px;
  height: 40px;
}

.pp-content {
  padding: 10px 16px 0 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.pp-card {
  background: #1c1e26;
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}

/* Profile */
.pp-profile-card {
  padding: 22px 18px 18px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pp-avatar-wrap {
  position: relative;
  margin-bottom: 14px;
}

.pp-avatar-ring {
  width: 118px;
  height: 118px;
  border-radius: 9999px;
  padding: 6px;
  background: #1c1e26;
  border: 3px solid rgba(255, 255, 255, 0.08);
}

.pp-avatar {
  width: 100%;
  height: 100%;
}

.pp-qr-badge {
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2eff7b;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  border: 4px solid #1c1e26;
}

.pp-name {
  font-size: 22px;
  font-weight: 800;
  line-height: 1.15;
}

.pp-contact {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  font-weight: 600;
}

.pp-contact-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.pp-contact-ic {
  opacity: 0.9;
}

.pp-contact-txt {
  letter-spacing: 0.1px;
}

.pp-stats {
  margin-top: 18px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.pp-stat {
  border-radius: 18px;
  padding: 14px 14px;
  background: rgba(28, 28, 34, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.pp-stat-wide {
  grid-column: span 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.pp-stat-k {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
}

.pp-stat-v {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
}

.pp-stat-wide .pp-stat-v {
  margin-top: 0;
  font-size: 12px;
  font-weight: 800;
}

.pp-green {
  color: #2eff7b;
}

/* Sections */
.pp-sec-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.pp-sec-ic {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: rgba(46, 255, 123, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2eff7b;
}

.pp-sec-title {
  font-size: 16px;
  font-weight: 800;
}

/* Form */
.pp-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pp-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pp-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
}

.pp-input-wrap {
  position: relative;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 10px 40px 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.pp-input {
  width: 100%;
}

.pp-input-native {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1px;
}

.pp-input-ic {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.45);
}

.pp-save-btn {
  margin-top: 6px;
  border-radius: 18px;
  background: #2eff7b;
  color: #0b1a10;
  font-weight: 900;
  padding: 14px 16px;
  box-shadow: 0 0 26px rgba(46, 255, 123, 0.28);
}

/* Toggles */
.pp-toggles {
  display: flex;
  flex-direction: column;
}

.pp-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
}

.pp-toggle-txt {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 10px;
}

.pp-toggle-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.pp-toggle-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.35;
}

.pp-divider {
  height: 1px;
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
}

.pp-toggle .q-toggle__thumb {
  box-shadow: none;
}

/* Addresses */
.pp-addr-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  margin-top: 2px;
}

.pp-addr-title {
  font-size: 20px;
  font-weight: 900;
}

.pp-addr-add {
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  color: #2eff7b;
  font-weight: 900;
  padding: 6px 12px;
}

.pp-addr-add-ic {
  margin-right: 6px;
  color: #2eff7b;
}

.pp-addr-card {
  position: relative;
  overflow: hidden;
  padding: 18px;
}

.pp-addr-decor {
  position: absolute;
  right: -26px;
  top: -26px;
  width: 100px;
  height: 100px;
  border-radius: 9999px;
  background: rgba(46, 255, 123, 0.06);
  filter: blur(18px);
  pointer-events: none;
  z-index: 0;
}

.pp-addr-top,
.pp-addr-body {
  position: relative;
  z-index: 1;
}

.pp-addr-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.pp-addr-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pp-addr-ic {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2eff7b;
}

.pp-addr-ic-muted {
  color: rgba(255, 255, 255, 0.45);
}

.pp-addr-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pp-addr-name {
  font-weight: 900;
  font-size: 14px;
  color: #fff;
}

.pp-muted {
  color: rgba(255, 255, 255, 0.7);
}

.pp-addr-badge {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 700;
}

.pp-more-btn {
  border-radius: 9999px;
  color: rgba(255, 255, 255, 0.55);
}

.pp-addr-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pp-addr-line {
  display: flex;
  gap: 12px;
  margin-left: 52px;
}

.pp-addr-pipe {
  width: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
}

.pp-addr-lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 12px;
}

.pp-addr-l1 {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
}

.pp-addr-l2 {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.55);
}

.pp-addr-l3 {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.78);
}

.pp-addr-l4 {
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.35);
}

.pp-addr-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 12px;
}

.pp-dot {
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
}

/* Danger */
.pp-danger {
  margin-top: 6px;
  border-radius: 24px;
  padding: 18px;
  background: linear-gradient(135deg, rgba(255, 69, 58, 0.08), rgba(255, 69, 58, 0));
  border: 1px solid rgba(255, 69, 58, 0.2);
}

.pp-danger-head {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ff453a;
  margin-bottom: 10px;
}

.pp-danger-ic {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: rgba(255, 69, 58, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pp-danger-title {
  font-size: 16px;
  font-weight: 900;
}

.pp-danger-text {
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 14px;
}

.pp-danger-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pp-danger-input {
  border-radius: 14px;
  padding: 8px 12px;
  background: rgba(28, 28, 34, 0.75);
  border: 1px solid rgba(255, 69, 58, 0.2);
}

.pp-danger-input-native {
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.pp-danger-btn {
  border-radius: 14px;
  background: #ff453a;
  color: #fff;
  font-weight: 900;
  padding: 12px 14px;
  box-shadow: 0 14px 26px rgba(255, 69, 58, 0.2);
}

.pp-danger-btn-ic {
  margin-right: 8px;
}

.pp-bottom-spacer {
  height: 10px;
}

.q-page::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

:root {
  --q-color-ppgreen: #2eff7b;
}

</style>