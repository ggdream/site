<template>
  <v-app>
    <nav-bar />

    <v-main>
      <transition name="fade">
        <router-view class="page" />
      </transition>
    </v-main>

    <foo-bar />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import NavBar from '@/components/navbar/NavBar.vue'
import FooBar from '@/components/footer/Footer.vue'

export default Vue.extend({
  name: 'App',
  components: {
    NavBar,
    FooBar,
  },
})
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>