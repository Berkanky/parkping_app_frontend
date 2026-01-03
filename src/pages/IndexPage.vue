<template>
  <q-page class="q-pa-md">
    <div v-show="this.vehicles.length" v-for="(data, key) in this.vehicles" :key="key">
      <vehicle_card :_id="data._id" :make="data.make" :model="data.model" :plate="data.plate" :color="data.color"
        :example_picture_id="data.example_picture_id" @selected_vehicle_id="get_selected_vehicle_id" />
    </div>
    <add_vehicle_card 
      v-show="!this.vehicles.length"/>
    <div class="pp-bottom-bar">
      <q-btn class="pp-add-btn" unelevated no-caps icon="add" label="Add Vehicle" @click="go_add_vehicle_page" />
    </div>
  </q-page>
</template>

<script>
import { UseStore } from '../stores/store';

import vehicle_card from '../components/vehicle_card.vue';
import add_vehicle_card from '../components/add_vehicle_card.vue';

export default {
  components: {
    vehicle_card,
    add_vehicle_card
  },
  setup() {
    var store = UseStore();
    return {
      store
    }
  },
  data: function () {
    return {
      vehicles: []
    }
  },
  async mounted() {
    await this.get_my_vehicles();
  },
  methods: {
    go_add_vehicle_page() {
      this.$router.push({name:'add-vehicle', params:{ user_id: this.store.user_data._id }});
    },
    get_selected_vehicle_id(_id) {
      var vehicle_id = _id;
      if (!vehicle_id) return;
      this.$router.push({ name: 'vehicle-profile', params: { vehicle_id: vehicle_id } });
    },
    async get_my_vehicles() {

      var res = await this.$api.get('/my-vehicles');
      console.log("my_vehicles_service -> " + JSON.stringify(res));
      if (res.status !== 200) return;

      this.vehicles = res.data.vehicles;
    }
  }
};
</script>

<style scoped>
.pp-page {
  padding: 14px 14px 0 14px;
  background: #f6f7fb;
}

.pp-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: calc(92px + env(safe-area-inset-bottom));
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

.pp-add-btn {
  width: 100%;
  height: 54px;
  border-radius: 18px;
  font-weight: 850;
  letter-spacing: .2px;
  background: #111827;
  color: #fff;
}
</style>