<template>
    <div>
        test<!-- 
        <GoogleLoginComponent /> -->
    </div>
</template>

<script>
import GoogleLoginComponent from '../components/google_login_component.vue'
import { UseStore } from '../stores/store';
export default {
    components: {
        GoogleLoginComponent
    },
    setup() {
        var store = UseStore();
        return {
            store
        }
    }
}
</script>

<style></style>