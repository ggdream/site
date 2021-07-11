<template>
  <div class="app">
    <wrapper
      :src="require('@/assets/icons/android.svg')"
      @click="onClickAndroid"
    />
    <wrapper
      :src="require('@/assets/icons/ios.svg')"
      @click="onClickiOS"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Wrapper from "./Wrapper.vue";

export default Vue.extend({
  name: "App",
  components: { Wrapper },
  data() {
    return {};
  },
  methods: {
    onClickAndroid(): void {
        console.log('222');
        
    },
    onClickiOS(): void {
      console.log(1111);
    },
  },
});
</script>

<style scoped lang="scss">
.app {
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
</style>
