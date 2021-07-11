<template>
  <div class="join">
    <v-card max-width="400" class="pa-4">
      <v-row class="px-8 my-2">
        <v-col cols="9" class="mt-2">
          <v-row><span class="text-h6">魔咔啦咔</span></v-row>
          <v-row
            ><v-icon size="14px">mdi-map-marker</v-icon
            ><span class="text-caption">四川·成都 -- 2000.01</span></v-row
          >
        </v-col>
        <v-col cols="3">
          <v-avatar>
            <img :src="avatar" alt="" />
          </v-avatar>
        </v-col>
      </v-row>

      <v-card-subtitle>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr v-for="item in items" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.data }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Meta } from '@/global'
import Vue from 'vue'

export default Vue.extend({
  name: 'Join',
  data() {
    return {
      avatar: Meta.avatar,
      items: [
        {
          name: '扣扣',
          data: '1586616064',
        },
        {
          name: '推特',
          data: 'mocarakao',
        },
        {
          name: '邮箱',
          data: 'gdream@126.com',
        },
      ],
    }
  },
})
</script>

<style scoped lang="scss">
.join {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(30deg, #98adda, #fcd2d3);
}
</style>
