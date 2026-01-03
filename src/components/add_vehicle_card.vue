<template>
  <q-card class="pp-add-card" flat bordered>
    <q-item clickable v-ripple class="pp-add-item" @click="goAdd">
      <div class="pp-add-wrap">

        <div class="pp-add-icon">
          <q-icon name="directions_car" size="32px" />
        </div>

        <div class="pp-add-content">
          <div class="pp-add-title">
            No vehicles yet
          </div>

          <div class="pp-add-subtitle">
            Add your first vehicle to start using ParkPing features.
          </div>
        </div>

        <div class="pp-add-action">
          <q-btn
            round
            flat
            icon="add"
            class="pp-add-btn"
            @click.stop="goAdd"
          />
        </div>

      </div>
    </q-item>
  </q-card>
</template>

<script>
export default {
  name: 'add_vehicle_card',
  methods: {
    goAdd () {
      this.$router.push({ name: 'add-vehicle' })
    }
  }
}
</script>

<style scoped>
.pp-add-card {
  width: 100%;
  border-radius: 24px;
  background: #ffffff;
  border: 1px dashed rgba(17, 24, 39, 0.18);
  box-shadow:
    0 10px 26px rgba(17, 24, 39, 0.06),
    0 2px 6px rgba(17, 24, 39, 0.04);
}

.pp-add-item {
  padding: 18px;
}

.pp-add-item:active {
  transform: scale(0.99);
}

.pp-add-wrap {
  display: flex;
  align-items: center;
  gap: 18px;
}

.pp-add-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  flex: 0 0 64px;
}

.pp-add-content {
  flex: 1;
  min-width: 0;
}

.pp-add-title {
  font-size: 20px;
  font-weight: 800;
  color: #0b0f19;
  letter-spacing: 0.2px;
}

.pp-add-subtitle {
  margin-top: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #6b7280;
  line-height: 1.3;
}

.pp-add-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  flex: 0 0 44px;
}

.pp-add-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #f3f4f6;
  color: #111827;
}

.pp-add-btn:active {
  background: #e5e7eb;
}

.pp-add-btn :deep(.q-icon) {
  font-size: 22px;
}
</style>
