<template>
  <v-app-bar app dark>
    <meta-info />

    <v-spacer></v-spacer>
    <div class="navlist mr-12 d-xs-none">
      <div class="navitem" v-for="(item, idx) in items" :key="idx">
        <nav-item :label="item.label" :to="item.to" />
      </div>
    </div>

    <!-- <down-app /> -->

    <v-menu transition="scale-transition" origin="center center" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar class="avatar" v-bind="attrs" v-on="on">
          <img :src="avatar" alt="" />
        </v-avatar>
      </template>
      <v-list>
        <v-list-item @click="onClick('https://github.com/ggdream')">
          <v-list-item-title v-text="'😎：GitHub'"></v-list-item-title>
        </v-list-item>
        <v-list-item @click="onClick('https://space.bilibili.com/264346349')">
          <v-list-item-title v-text="'🤩：哔哩哔哩'"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { Meta } from '@/global'
import Vue from 'vue'
import RouteMap from './meta'
// import DownApp from "./DownApp.vue";
import MetaInfo from './MetaInfo.vue'
import NavItem from './NavItem.vue'

export default Vue.extend({
  name: 'NavBar',
  components: {
    // DownApp,
    MetaInfo,
    NavItem,
  },
  data: () => ({
    items: RouteMap,
    avatar: Meta.avatar,
  }),
  methods: {
    onClick(url: string): void {
      window.open(url)
    },
  },
})
</script>

<style lang="scss" scoped>
.navlist {
  display: flex;
}

.avatar {
  cursor: pointer;
}
</style>
