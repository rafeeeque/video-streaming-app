<template>
    <div class="spinner-overlay" v-if=isLoading>
        <q-spinner :size="size" :color="color" />
        <div class="loading-text">{{ loadingText }}</div>
    </div>
</template>

<script>
export default {
    computed: {
        isLoading() {
            return this.$store.getters.isLoading;
        },
        loadingText() {
            return this.$store.getters.loadingText;
        },
        size() {
            return 50;
        },
        color() {
            return 'primary';
        }
    }
};
</script>
<style scoped>
.spinner-overlay {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Adjust opacity as needed */
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading-text {
    margin-top: 10px;
    color: white;
}
</style>
