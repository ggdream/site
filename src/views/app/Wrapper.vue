<template>
  <div class="wrapper">
    <img
      :src="src"
      alt=""
      draggable="false"
    >
    <v-btn
      depressed
      color="#b8bedd"
      class="white--text"
      @click="onClick"
    >点击下载</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Wrapper",
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClick(): void {
      this.$emit("click");
    },
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  width: 156px;
  height: 196px;
  background-color: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>