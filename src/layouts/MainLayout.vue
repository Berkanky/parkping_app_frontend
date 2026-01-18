<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="app_header" v-if="this.checkRouteMeta() && this.is_sidebar_button_active()">
      <q-toolbar class="q-px-md" style="height:56px;">
        <q-btn dense flat round icon="menu" @click="leftDrawerToggle()" />
        <q-toolbar-title class="text-center">
          <!-- {{ this.dynamic_header_title() }} -->
        </q-toolbar-title>
        <div style="width:38px;"></div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="left_drawer_open" side="left" overlay behavior="mobile" :width="320" class="text-white"
      style="background:  #1c1c22 ;">
      <div class="pp-wrap">
        <div class="pp-top">
          <div class="pp-brand">
            <div class="pp-logo">
              <q-avatar size="sm">
                <img src="../images/parkping_app_logo_black.svg" />
              </q-avatar>
            </div>
            <div class="pp-brand-text">ParkPing <!-- <span style="font-size:10px;">- {{ this.store.app_version }}</span> --></div>
          </div>
          <q-btn dense flat round icon="chevron_left" class="pp-close" @click="left_drawer_open = false" />
        </div>
        <div class="pp-profile">
          <q-avatar size="88px">
            <img :src="userAvatar" alt="avatar" />
          </q-avatar>
          <div class="pp-name">{{ fullName }}</div>
          <!-- <div class="pp-email">{{ email }}</div> -->
        </div>
        <div class="pp-divider"></div>
        <q-list class="pp-menu" padding>
          <q-item clickable v-ripple :active="isActive('/home')" active-class="pp-active" class="pp-item"
            @click="go('/home')">
            <q-item-section avatar class="pp-icon">
              <q-icon name="directions_car" />
            </q-item-section>
            <q-item-section class="pp-text">
              My Cars
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple :active="isActive('/profile')" active-class="pp-active" class="pp-item"
            @click="go_profile_page()">
            <q-item-section avatar class="pp-icon">
              <q-icon name="person" />
            </q-item-section>
            <q-item-section class="pp-text">
              Profile
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple :active="isActive(`/access-details/${this.store.user_data._id}`)"
            active-class="pp-active" class="pp-item" @click="go(`/access-details/${this.store.user_data._id}`)">
            <q-item-section avatar class="pp-icon">
              <q-icon name="qr_code_scanner" />
            </q-item-section>
            <q-item-section class="pp-text">
              QR History
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple :active="isActive('/notifications')" active-class="pp-active" class="pp-item"
            @click="go('/notifications')">
            <q-item-section avatar class="pp-icon">
              <q-icon name="notifications" />
            </q-item-section>
            <q-item-section class="pp-text">
              Notifications
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple :active="isActive('/verify-access-token')" active-class="pp-active" class="pp-item"
            @click="go('/verify-access-token')">
            <q-item-section avatar class="pp-icon">
              <q-icon name="search"/>
            </q-item-section>
            <q-item-section class="pp-text">
              Scan Vehicle
            </q-item-section>
          </q-item>
        </q-list>
        <div class="pp-spacer"></div>
        <div class="pp-bottom">
          <q-btn outline no-caps class="pp-logout" icon="logout" label="Logout" @click="this.logout_service()" />
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { UseStore } from '../stores/store';

export default {
  setup() {
    var store = UseStore()
    return { store }
  },
  data() {
    return {
      left_drawer_open: false
    }
  },
  computed: {
    fullName() {
      var n = this.store?.user_data?.name || '-';
      var s = this.store?.user_data?.surname || '-';
      return `${n} ${s}`.trim()
    },
    email() {
      return this.store?.user_data?.email_address || '-';
    },
    userAvatar() {
      return this.store?.user_data?.profile_picture || 'https://cdn.quasar.dev/img/avatar.png'
    }
  },
  methods: {
    is_sidebar_button_active() {
      var active_path_name_list = ['home'];
      var route_name = this.$route.name;
      return active_path_name_list.some(function (item) { return item == route_name });
    },
    go_profile_page() {
      this.$router.push({ name: 'profile' })
    },
    dynamic_header_title() {
      var current_route_name = this.$route.name;
      if (current_route_name == 'home') return 'My Vehicles'
      else return null;
    },
    checkRouteMeta() {
      return this.$route?.meta?.requires_auth
    },
    leftDrawerToggle() {
      this.left_drawer_open = !this.left_drawer_open
    },
    isActive(path) {
      return this.$route?.path === path
    },
    go(path) {
      this.left_drawer_open = false
      if (this.$route?.path !== path) this.$router.push(path)
    },
    async logout_service() {

      var res = await this.$api.post('/logout');
      if (res.status !== 200) return;

      this.store.user_data = {};
      this.$router.replace({ path: '/login' });

      this.left_drawer_open = false;
    }
  }
}
</script>

<style scoped>
.profile_icon {
  background: #2eff7b;
  color: black;
}

.app_header {
  background: #1c1c22;
}

.pp-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 18px 18px 14px 18px;
}

.pp-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
}

.pp-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pp-logo {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pp-brand-text {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.pp-profile {
  padding-top: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.pp-name {
  margin-top: 14px;
  font-size: 18px;
  font-weight: 800;
}

.pp-email {
  margin-top: 6px;
  font-size: 13px;
}

.pp-divider {
  height: 1px;
  margin: 18px 0 10px 0;
}

.pp-menu {
  padding-top: 6px;
}

.pp-item {
  border-radius: 14px;
  padding: 14px 14px;
  margin: 6px 0;
}

.pp-icon :deep(.q-icon) {
  font-size: 22px;
}

.pp-text {
  font-size: 15px;
  font-weight: 600;
}

.pp-active {
  background: #24242b !important;
}

.pp-active .pp-text {
  color: #fff !important;
}

.pp-active .pp-icon :deep(.q-icon) {
  color: #fff !important;
}

.pp-spacer {
  flex: 1;
}

.pp-bottom {
  padding-top: 12px;
}

.pp-logout {
  width: 100%;
  height: 34px;
  border-radius: 18px;
  font-weight: 850;
  letter-spacing: .2px;
}

.pp-version {
  margin-top: 14px;
  text-align: center;
  font-size: 11px;
  letter-spacing: 1.6px;
}
</style>