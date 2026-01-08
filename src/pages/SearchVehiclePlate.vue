<template>
  <q-page class="pp-auth">
    <div class="pp-topbar">
      <q-btn flat round icon="chevron_left" class="pp-back text-white" @click="go_back" />

     <!--  <div class="pp-brand">
        <div class="pp-brand-glow"></div>
        <q-avatar size="md" class="pp-logo">
          <img src="../images/splash_screen_logo.svg" alt="">
        </q-avatar>
      </div> -->
    </div>

    <div class="pp-wrap">
      <div class="pp-mid">
        <div class="pp-title">Search Vehicle Plate</div>
        <div class="pp-subtitle">Enter the identifier to connect</div>

        <q-input
          v-model="plate"
          class="pp-input"
          borderless
          placeholder="EX. 34 ARG 76"
          input-class="pp-input-native"
        >
          <template v-slot:prepend>
            <div class="pp-prepend">
              <q-icon name="qr_code_scanner" size="20px" class="pp-prepend-ic" />
            </div>
          </template>
        </q-input>
      </div>

      <div class="pp-bottom">
        <q-btn
          icon-right="search"
          unelevated
          no-caps
          class="pp-btn"
          label="Search"
          @click="on_search()"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { UseStore } from 'src/stores/store';
export default {
    name: "VehiclePlateSearch",
    setup() {
        var store = UseStore();
        return {
            store
        }
    },
    data() {
        return {
            plate: ""
        }
    },
    methods: {
        go_back() {
            if (window.history.length > 1) {
                this.$router.back();
            } else {
                this.$router.replace({ name: 'home' });
            }
        },
        async on_search() {
            var res = await this.$api.post('/search-vehicle-plate', { plate: this.plate });
            if (res.status !== 200) return;

            var { vehicle_id } = res.data;

            this.$router.replace({ name: 'vehicle-profile', params: { vehicle_id: vehicle_id } });
        }
    }
}
</script>

<style>
.pp-auth{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  background:#1c1c22;
  background-image:url("../images/BG-parkping-2.png");
  background-size:cover;
  background-position:center;
  background-repeat:no-repeat;
}

.pp-topbar{
  height:74px;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  padding:0 12px;
}

.pp-back{
  position:absolute;
  left:10px;
  width:42px;
  height:42px;
  border-radius:14px;
  opacity:.95;
}

.pp-brand{
  display:flex;
  align-items:center;
  gap:10px;
  position:relative;
  transform:translateY(-2px);
}

.pp-brand-glow{
  position:absolute;
  left:10px;
  top:50%;
  width:26px;
  height:26px;
  border-radius:50%;
  transform:translate(-50%,-50%);
  background:rgba(0,255,163,.22);
  filter:blur(6px);
}

.pp-logo{
  width:100px;
  height:34px;
  border-radius:12px;
}

.pp-logo img{
  width:100%;
  height:100%;
  object-fit:contain;
}

.pp-brand-text{
  color:#ffffff;
  font-size:20px;
  font-weight:700;
  letter-spacing:.2px;
}

.pp-wrap{
  flex:1 1 auto;
  display:flex;
  flex-direction:column;
  padding:26px 18px 22px;
}

.pp-mid{
  flex:1 1 auto;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  gap:14px;
}

.pp-title{
  color:#ffffff;
  font-size:20px;
  line-height:1.05;
  font-weight:800;
  letter-spacing:.2px;
  text-shadow:0 8px 22px rgba(0,0,0,.45);
}

.pp-subtitle{
  color:rgba(255,255,255,.55);
  font-size:14px;
  letter-spacing:.25px;
  margin-top:-4px;
}

.pp-input{
  width:min(92%, 460px);
  border-radius:18px;
  padding:0 14px;
  display:flex;
  align-items:center;
  background:rgba(36,36,43,.88);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.06),
    0 14px 28px rgba(0,0,0,.22);
  backdrop-filter: blur(6px);
}

.pp-prepend{
  width:44px;
  height:44px;
  border-radius:14px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(0,0,0,.18);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
}

.pp-prepend-ic{
  color:rgba(255,255,255,.55);
}

.pp-input-native{
  color:#ffffff !important;
  font-size:18px;
  letter-spacing:2.2px;
  text-transform:uppercase;
}

.pp-input .q-field__native::placeholder{
  color:rgba(255,255,255,.22);
  letter-spacing:2px;
}

.pp-bottom{
  display:flex;
  flex-direction:column;
  align-items:center;
  padding-bottom: 14px;
}

.pp-btn{
  width:min(92%, 460px);
  border-radius:26px;
  background:#fff;
  color:#24242b;
  font-size:18px;
  letter-spacing:2px;
  box-shadow:
    0 18px 45px rgba(0,255,163,.22),
    0 10px 26px rgba(0,0,0,.35);
}

.pp-btn .q-icon{
  font-size:22px;
}

.pp-foot{
  margin-top:4px;
  font-size:12px;
  letter-spacing:.6px;
  color:rgba(255,255,255,.18);
}
</style>