<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="app_header text-dark" v-if="checkRouteMeta()">
      <q-toolbar class="q-px-md" style="height:56px;">
        <q-btn dense flat round icon="menu" @click="leftDrawerToggle()" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="left_drawer_open"
      side="left"
      overlay
      behavior="mobile"
      :width="320"
      class="pp-drawer"
    >
      <div class="pp-wrap">

        <div class="pp-top">
          <div class="pp-brand">
            <div class="pp-logo">
              <q-avatar size="sm">
                <img src="../images/parkping_app_logo.svg"/>
              </q-avatar>
            </div>
            <div class="pp-brand-text">ParkPing</div>
          </div>

          <q-btn
            dense
            flat
            round
            icon="chevron_left"
            class="pp-close"
            @click="left_drawer_open = false"
          />
        </div>

        <div class="pp-profile">
          <q-avatar size="88px">
            <img :src="userAvatar" alt="avatar" />
          </q-avatar>

          <div class="pp-name">{{ fullName }}</div>
          <div class="pp-email">{{ email }}</div>
        </div>

        <div class="pp-divider"></div>

        <q-list class="pp-menu" padding>
          <q-item
            clickable
            v-ripple
            :active="isActive('/home')"
            active-class="pp-active"
            class="pp-item"
            @click="go('/home')"
          >
            <q-item-section avatar class="pp-icon">
              <q-icon name="home" />
            </q-item-section>
            <q-item-section class="pp-text">
              My Cars
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="isActive('/profile')"
            active-class="pp-active"
            class="pp-item"
            @click="go('/profile')"
          >
            <q-item-section avatar class="pp-icon">
              <q-icon name="person" />
            </q-item-section>
            <q-item-section class="pp-text">
              Profile
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="isActive(`/add-vehicle/${this.store.user_data._id}`)"
            active-class="pp-active"
            class="pp-item"
            @click="go(`/add-vehicle/${this.store.user_data._id}`)"
          >
            <q-item-section avatar class="pp-icon">
              <q-icon name="add_circle" />
            </q-item-section>
            <q-item-section class="pp-text">
              Add Car
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="isActive(`/access-details/${this.store.user_data._id}`)"
            active-class="pp-active"
            class="pp-item"
            @click="go(`/access-details/${this.store.user_data._id}`)"
          >
            <q-item-section avatar class="pp-icon">
              <q-icon name="qr_code_scanner" />
            </q-item-section>
            <q-item-section class="pp-text">
              QR History
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="isActive('/notifications')"
            active-class="pp-active"
            class="pp-item"
            @click="go('/notifications')"
          >
            <q-item-section avatar class="pp-icon">
              <q-icon name="notifications" />
            </q-item-section>
            <q-item-section class="pp-text">
              Notifications
            </q-item-section>
          </q-item>
        </q-list>

        <div class="pp-spacer"></div>

        <div class="pp-bottom">
          <q-btn
            outline
            no-caps
            class="pp-logout"
            icon="logout"
            label="Logout"
            @click="this.logout_service()"
          />

          <div class="pp-version">VERSION 2.4.0</div>
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
  setup () {
    var store = UseStore()
    return { store }
  },
  data () {
    return {
      left_drawer_open: false
    }
  },
  computed: {
    fullName () {
      var n = this.store?.user_data?.name || '-';
      var s = this.store?.user_data?.surname || '-';
      return `${n} ${s}`.trim()
    },
    email () {
      return this.store?.user_data?.email_address || '-';
    },
    userAvatar () {
      return this.store?.user_data?.profile_picture || 'https://cdn.quasar.dev/img/avatar.png'
    }
  },
  methods: {
    checkRouteMeta () {
      return this.$route?.meta?.requires_auth
    },
    leftDrawerToggle () {
      this.left_drawer_open = !this.left_drawer_open
    },
    isActive (path) {
      return this.$route?.path === path
    },
    go (path) {
      this.left_drawer_open = false
      if (this.$route?.path !== path) this.$router.push(path)
    },
    async logout_service () {

      var res = await this.$api.post('/logout');
      console.log("logout_service -> " + JSON.stringify(res));
      if( res.status !== 200 ) return;
      
      this.store.user_data = {};
      this.$router.replace({ path:'/login' });

      this.left_drawer_open = false;
    }
  }
}
</script>

<style scoped>
.app_header{
  background: white;
}
.pp-drawer {
  background: #f3f4f6;
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
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pp-brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #111;
  letter-spacing: 0.2px;
}

.pp-close {
  color: #111;
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
  color: #111;
}

.pp-email {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
}

.pp-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 18px 0 10px 0;
}

.pp-menu {
  padding-top: 6px;
}

.pp-item {
  border-radius: 14px;
  padding: 14px 14px;
  margin: 6px 0;
  color: #111;
}

.pp-icon :deep(.q-icon) {
  font-size: 22px;
  color: #111;
}

.pp-text {
  font-size: 15px;
  font-weight: 600;
  color: #111;
}

.pp-active {
  background: #000 !important;
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
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 700;
  color: #111;
}

.pp-version {
  margin-top: 14px;
  text-align: center;
  font-size: 11px;
  letter-spacing: 1.6px;
  color: #9ca3af;
}
</style>