<template>
  <q-page class="pp-page">
    <div v-if="!vehicles.length" class="pp-empty">
      <img src="../images/car_icon.svg">
      <div class="pp-empty-title">
        You're in! Add your first car now.
      </div>
    </div>
    <div v-else class="pp-list">
      <div 
        v-for="(data, key) in vehicles" :key="data._id || key">
        <vehicle_card :_id="data._id" :make="data.make" :model="data.model" :plate="data.plate" :color="data.color"
          :example_picture_id="data.example_picture_id" @selected_vehicle_id="get_selected_vehicle_id" @deleted_vehicle_id="get_deleted_vehicle_id"/>
      </div>
    </div>
    <div class="pp-bottom-bar">
      <q-btn class="pp-add-btn bg-white text-dark" unelevated no-caps icon="add" label="Add Vehicle"
        @click="go_add_vehicle_page" />
    </div>
  </q-page>
</template>

<script>
import { UseStore } from '../stores/store';
import vehicle_card from '../components/vehicle_card.vue';

export default {
  components: {
    vehicle_card
  },
  setup() {
    var store = UseStore();
    return {
      store
    }
  },
  data: function () {
    return {
      vehicles: [],
      selected_vehicles:[]
    }
  },
  async mounted() {
    await this.get_my_vehicles();
  },
  methods: {
    async get_deleted_vehicle_id(_id){
      var vehicle_id = _id;
      if (!vehicle_id) return;
      
      var res = await this.$api.put('/delete-vehicle', { vehicle_id: vehicle_id });
      if( res.status !== 204 ) return;

      this.vehicles = this.vehicles.filter(function(item){ return item._id !== vehicle_id });
    },
    go_add_vehicle_page() {
      this.$router.push({ name: 'add-vehicle', params: { user_id: this.store.user_data._id }, query:{ action_type: 'create' } });
    },
    get_selected_vehicle_id(_id) {
      var vehicle_id = _id;
      if (!vehicle_id) return;

      this.$router.push({ name: 'vehicle-profile', params: { vehicle_id: vehicle_id } });
    },
    async get_my_vehicles() {
      var res = await this.$api.get('/my-vehicles');
      if (res.status !== 200) return;

      this.vehicles = res.data?.vehicles || [];
    }
  }
};
</script>

<style scoped>
.pp-page {
  padding: 14px 14px 0 14px;
  background: #1C1C22;
  background-image: url("../images/BG-parkping.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  background: #1C1C22;
  backdrop-filter: blur(10px);
  z-index: 50;
}

.pp-add-btn {
  width: 100%;
  height: 34px;
  border-radius: 18px;
  font-weight: 850;
  letter-spacing: .2px;
}

.pp-empty {
  height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

.pp-empty :deep(.q-icon) {
  color: #2eff7b;
}

.pp-empty-title {
  color: #cfcfd4;
  font-size: 14px;
  font-weight: 500;
}
</style>