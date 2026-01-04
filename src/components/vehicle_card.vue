<template>
  <q-card class="pp-vehicle-card" flat bordered>
    <q-item clickable v-ripple class="pp-item" @click="go_detail(_id)">
      <q-item-section avatar class="pp-avatar">
        <div class="pp-img-wrap">
          <q-img
            class="pp-img"
            :src="example_picture_id ? get_vehicle_example_picture() : undefined"
            :ratio="4 / 3"
            fit="cover"
            no-spinner
          >
            <template v-slot:loading>
              <div class="pp-img-ph">
                <q-spinner size="24px" />
              </div>
            </template>

            <template v-slot:error>
              <div class="pp-img-ph">
                <q-icon name="directions_car" size="28px" />
                <div class="pp-img-ph-text">No Picture</div>
              </div>
            </template>

            <template v-slot:default>
              <div v-if="!example_picture_id" class="pp-img-ph">
                <q-icon name="add_a_photo" size="28px" />
                <div class="pp-img-ph-text">Add Image</div>
              </div>
            </template>
          </q-img>
        </div>
      </q-item-section>

      <q-item-section class="pp-content">
        <div class="pp-title text-white">{{ make }}</div>
        <div class="pp-subtitle text-grey-6">{{ model }} - {{ color }}</div>

        <div class="pp-plate text-white">
          <q-icon name="badge" size="16px" class="pp-plate-icon" />
          <div class="pp-plate-text">{{ plate }}</div>
        </div>
      </q-item-section>

      <q-item-section side class="pp-side" aria-hidden="true">
        <q-icon name="chevron_right" class="pp-right-icon text-white" />
      </q-item-section>
    </q-item>
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
  emits: ['selected_vehicle_id'],
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
    }
  }
}
</script>

<style scoped>
.pp-vehicle-card {
  width: 100%;
  border-radius: 10px;
  background: #24242b;
  border: 1px solid rgba(17, 24, 39, 0.06);
  box-shadow: 0 10px 28px rgba(17, 24, 39, 0.06);
  overflow: hidden;
}

.pp-item {
  padding: 11px;
  min-height: unset;
  transition: transform 0.12s ease;
}

.pp-item:active {
  transform: scale(0.992);
}

.pp-avatar {
  padding-right: 14px;
}

.pp-img-wrap {
  width: 118px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(17, 24, 39, 0.06);
  background: #24242b;
}

.pp-img {
  border-radius: 10px;
}

.pp-img-ph {
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #24242b;
}

.pp-img-ph-text {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.pp-content {
  min-width: 0;
}

.pp-title {
  font-size: 18px;
  font-weight: 850;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pp-subtitle {
  margin-top: 5px;
  font-size: 14px;
  font-weight: 650;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pp-plate {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background: #24242b;
}

.pp-plate-text {
  font-size: 13px;
  font-weight: 850;
  letter-spacing: 1.1px;
}

.pp-side {
  width: 34px;
  padding-left: 10px;
  justify-content: center;
}

.pp-right-icon {
  font-size: 24px;
}
</style>