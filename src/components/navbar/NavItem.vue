<template>
  <v-btn
    text
    :to="to"
    class="mx-1"
  >
    <span
      class="caption"
      :style="{fontWeight: isActive ? 'bold' : 'normal'}"
    >
      {{ label }}
    </span>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "NavItem",
  props: {
    label: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    isActive(): boolean {
      return this.$route.path.includes(this.to);
    },
  },
});
</script>