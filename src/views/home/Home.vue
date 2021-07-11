<template>
  <div class="home">
    <swiper
      class="swiper"
      :options="swiperOption"
    >
      <swiper-slide
        v-for="(item, idx) in items"
        :key="idx"
      ><show-img :url="`http://qvgbcgfc6.hn-bkt.clouddn.com/insert/${idx+1}.svg`" /></swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ShowImg from './Show.vue'
import {
  Swiper as SwiperClass,
  Pagination,
  Mousewheel,
  Autoplay,
} from "swiper/js/swiper.esm";
import getAwesomeSwiper from "vue-awesome-swiper/dist/exporter";
import "swiper/css/swiper.css";

SwiperClass.use([Pagination, Mousewheel, Autoplay]);
const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass);

export default Vue.extend({
  name: "Home",
  components: {
    Swiper,
    SwiperSlide,
    ShowImg,
  },
  data() {
    return {
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
      },
      items: ["a", "b"],
    };
  },
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(30deg,#98adda,#fcd2d3);
  .swiper {
    width: 80%;
    background-color: #fff;
  }
}
</style>
