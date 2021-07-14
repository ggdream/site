<template>
  <div class="home">
    <v-chip
      class="ma-2"
      color="black"
      outlined
      v-for="(text, i) in textList"
      :key="i"
    >
      {{ text }}
    </v-chip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import textList from './text'

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      textList,
    }
  },
})
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(30deg, #98adda, #fcd2d3);
}
</style>
