<template>
  <v-footer dark class="footer">
    <div class="slogan subtitle-2 fcolor">
      虽然很渺小，双手却依然紧握
    </div>
    <div class="caption fcolor">
      © 2021 魔咔啦咔 版权所有 &nbsp;&nbsp;&nbsp; & &nbsp;&nbsp;&nbsp;
      <a href="https://beian.miit.gov.cn/" target="_blank"
        >Powered by GitHub Pages</a
      >
    </div>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Footer',
})
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  flex-direction: column;
  .slogan {
    margin-bottom: 12px;
  }
  .fcolor {
    color: #fff;
    opacity: 0.4;
    a {
      text-decoration: none;
      color: inherit;
    }
  }
}
</style>
