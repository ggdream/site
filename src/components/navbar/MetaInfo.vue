<template>
    <div
        class="meta d-flex align-center"
        @click="$router.push('/')"
    >
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="@/assets/logo.svg"
        transition="scale-transition"
        width="40"
      />

      <h1 class="name">{{ appMetaInfo.appName }}</h1>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Meta } from "@/global"

export default Vue.extend({
    name: 'MetaInfo',
    data(){
        return {
            appMetaInfo: Meta
        }
    }
})
</script>

<style lang="scss" scoped>
    .meta {
        cursor: pointer;
        .name {
            font-size: 20px;
        }
    }
</style>