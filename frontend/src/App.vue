<template>
  <q-layout>
    <q-page-container>
      <router-view></router-view>
      <!-- Global loading indicator -->
      <loading-indicator />
    </q-page-container>
  </q-layout>
</template>

<script>
import LoadingIndicator from './components/Loading.vue';
export default {
  name: 'App',
  components: {
    LoadingIndicator
  }
};
</script>
