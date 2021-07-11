<template>
  <div class="about">
    <v-carousel
      class="main"
      interval="3000"
      cycle
      hide-delimiters
    >
      <v-carousel-item
        v-for="(v, i) in items"
        :key="i"
        :src="v"
        reverse-transition="fade-transition"
        transition="fade-transition"
      >

      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "About",
  data() {
    return {
      items: [
          "/images/insert/1.svg",
          "/images/insert/2.svg",
      ],
    };
  },
});
</script>

<style scoped lang="scss">
.about {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(30deg,#98adda,#fcd2d3);
  .main {
    width: 60%;
    margin: 32px 0;
  }
}
</style>