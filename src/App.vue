<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios';
import { UseStore } from './stores/store';
import { defineComponent } from 'vue';
import { AddressbarColor } from 'quasar'

export default defineComponent({
  name: 'App',
  setup() {
    var store = UseStore();
    return {
      store
    }
  },
  async mounted() {
    AddressbarColor.set('#1c1c22');
    await this.store.get_user_details();
  }
});
</script>

<style>
html,
body,
#app {
  -ms-overflow-style: none;
  /* IE/Edge legacy */
  scrollbar-width: none;
  /* Firefox */
}

html::-webkit-scrollbar,
body::-webkit-scrollbar,
#app::-webkit-scrollbar {
  width: 0 !important;
  /* Chrome/Safari */
  height: 0 !important;
  display: none;
}

*::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}

* {
  scrollbar-width: none;
}
</style>
