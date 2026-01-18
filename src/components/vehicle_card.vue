<template>
  <q-card class="pp-vehicle-card" flat>
    <div class="pp-row"  @click="go_detail(_id)">
      <div class="pp-img-wrap">
        <q-img class="pp-img"
          :src="example_picture_id ? get_vehicle_example_picture() : 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop'"
          fit="cover" no-spinner>
        </q-img>
        <div class="pp-trash">
          <q-btn round dense flat icon="delete_outline" size="sm" class="pp-trash-btn" v-on:click.stop="this.delete_vehicle(_id)" />
        </div>
      </div>
      <div class="pp-content">
        <div class="pp-make">{{ make }}</div>
        <div class="pp-model">{{ model }}</div>

        <div class="pp-meta">
          {{ plate }} <span class="pp-divider">|</span> {{ color }}
        </div>
      </div>
      <div class="pp-side">
        <q-btn flat round dense icon="edit" color="white" size="sm" class="pp-side-btn"
          @click.stop="edit_existing_vehicle(_id)" />
      </div>
    </div>
  </q-card>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
  name: 'vehicle_card',
  props: {
    _id: { type: String, default: null },
    make: { type: String, default: '-' },
    model: { type: String, default: '-' },
    plate: { type: String, default: '-' },
    color: { type: String, default: '-' },
    example_picture_id: { type: String, default: '' }
  },
  emits: ['selected_vehicle_id', 'deleted_vehicle_id'],
  setup() {
    var store = UseStore();
    return { store };
  },
  methods: {
    get_vehicle_example_picture() {
      var backend_url = import.meta.env.VITE_BACKEND_URL;
      return backend_url + '/picture/' + this.example_picture_id;
    },
    go_detail(_id) {
      this.$emit('selected_vehicle_id', _id);
    },
    delete_vehicle(_id) {
      this.$emit('deleted_vehicle_id', _id);
    },
    edit_existing_vehicle(_id){
      this.$router.push({ name: 'add-vehicle', params: { user_id: this.store.user_data._id }, query:{ action_type: 'update', vehicle_id: _id } });
    }
  }
}
</script>

<style scoped>
.pp-vehicle-card {
  border-radius: 28px;
  background: #1c1e26;
  overflow: hidden;
  max-width: 500px;
}

.pp-row {
  display: flex;
  height: 150px;
  width: 100%;
  position: relative;
  align-items: center;
}

.pp-img-wrap {
  width: 150px;
  height: 150px;
  position: relative;
  padding: 12px;
}

.pp-img {
  border-radius: 24px;
  height: 100%;
  width: 100%;
}

.pp-trash {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
}

.pp-trash-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: #fff;
}

.pp-content {
  flex: 1;
  padding: 20px 10px 20px 5px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pp-make {
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.5px;
}

.pp-model {
  font-size: 15px;
  font-weight: 500;
  margin-top: 4px;
  opacity: 0.95;
}

.pp-meta {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 400;
  color: #a0a4b0;
}

.pp-divider {
  margin: 0 4px;
  opacity: 0.5;
}

.pp-side {
  padding-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pp-side-btn {
  opacity: 0.8;
  transition: opacity 0.3s;
}

.pp-side-btn:hover {
  opacity: 1;
}
</style>