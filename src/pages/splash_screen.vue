<template>
    <q-page class="bg-dark splash-container flex flex-center">
        <div class="logo-wrapper">
            <img class="splash-logo" src="../images/splash_screen_logo.svg" alt="ParkPing" />
            <div class="tagline">
                Fast communication for your vehicle.<br />
                No unnecessary noise.
            </div>
        </div>
    </q-page>
</template>

<script>
import { UseStore } from "../stores/store";

export default {
    setup() {
        var store = UseStore();
        return { store };
    },
    data() {
        return {
            timeout_id: null
        };
    },
    mounted() {
        this.timeout_id = setTimeout(() => {
            this.$router.replace({ path: "/home" });
        }, 3500);
    },
    beforeUnmount() {
        if (this.timeout_id) clearTimeout(this.timeout_id);
    }
};
</script>

<style scoped>
.tagline {
    margin-top: 14px;
    color: #b5b8bd;
    font-size: 13px;
    line-height: 1.4;
    text-align: center;
    opacity: 0.85;
}

.logo-wrapper {
    text-align: center;
}

.splash-logo {
    width: 160px;
    animation: floaty 2.8s ease-in-out infinite,
        glow 2.8s ease-in-out infinite;
    will-change: transform, filter;
}

@keyframes intro {
    from {
        opacity: 0;
        transform: translateY(6px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes floaty {
    0% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-8px) scale(1.01);
    }

    100% {
        transform: translateY(0) scale(1);
    }
}

@keyframes glow {
    0% {
        filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
        opacity: 0.92;
    }

    50% {
        filter: drop-shadow(0 10px 18px rgba(64, 255, 170, 0.18));
        opacity: 1;
    }

    100% {
        filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
        opacity: 0.92;
    }
}

@media (prefers-reduced-motion: reduce) {
    .splash-logo {
        animation: none;
    }
}
</style>