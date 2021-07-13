<template>
  <v-app>
    <nav-bar />

    <v-main>
      <transition name="fade">
        <router-view class="page" />
      </transition>
    </v-main>

    <iframe
      class="music"
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      width="330"
      height="86"
      :src="`//music.163.com/outchain/player?type=2&id=${current}&auto=1&height=66`"
    ></iframe>

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
  data() {
      return {
          songs: ["1393393546", "549362076", "549349804", "1346528158", "532124658", "1815077070", "1336465934"],
          current: "",
      }
  },
  created() {
    this.current = this.songs[Math.floor(Math.random() * this.songs.length)]
  }
})
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  background: linear-gradient(30deg, #98adda, #fcd2d3);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  background: linear-gradient(30deg, #98adda, #fcd2d3);
}

.music {
    position: fixed;
    right: 12px;
    bottom: 64px;
    z-index: 999;
}

// .page {
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   width: 100%;
//   margin: 0 auto;
// }
</style>
