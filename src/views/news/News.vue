<template>
  <div class="news">
    <v-card
      max-width="54vw"
      class="my-6 cursor"
      v-for="(v, i) in items"
      :key="i"
      @click="openIt(v.url)"
    >
      <v-img :src="v.image" height="18vw" class="white--text align-end">
        <v-card-title>{{ v.title }}</v-card-title>
        <v-card-subtitle class="white--text">
          {{ v.datetime }}
        </v-card-subtitle>
      </v-img>
    </v-card>

    <transition name="fade">
      <v-btn
        fixed
        fab
        right
        bottom
        color="#8acac0"
        class="white--text"
        @click="goTop"
        v-show="backTopShow"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'News',
  data() {
    return {
      items: [
        {
          title: '博客开业啦啦啦',
          datetime: '2021-07-11 13:42',
          image: '/images/cover/0.jpeg',
          url: 'https://www.google.com/',
        },
        {
          title: '搭建博客的路上',
          datetime: '2021-07-11 15:52',
          image: '/images/cover/2.jpeg',
          url: 'https://www.google.com/',
        },
      ],
      backTopShow: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.listen)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.listen)
  },
  methods: {
    openIt(url: string): Window | null {
      return window.open(url)
    },
    goTop(): void {
      scrollTo(0, 0)
    },
    listen(): void {
      if (document.documentElement.scrollTop > 100) {
        this.backTopShow = true
      } else {
        this.backTopShow = false
      }
    },
  },
})
</script>

<style scoped lang="scss">
.news {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(30deg,#98adda,#fcd2d3);

  .cursor {
    cursor: pointer;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
