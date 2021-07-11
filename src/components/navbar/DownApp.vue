<template>
  <v-btn text @click="$router.push('/app')">
    <v-icon>mdi-cloud-download</v-icon>
    <span class="ml-1">下载应用</span>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DownApp',
})
</script>
