<template>
    <div class="rem">
        <v-container>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th
                    class="text-center"
                    v-for="title in titles"
                    :key="title"
                  >{{title}}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                class="text-center"
                  v-for="item in items"
                  :key="item.name"
                >
                  <td>
                    <v-avatar size="24">
                      <img :src="require(`@/assets/img/icon/${item.icon}.svg`)" alt="none">
                    </v-avatar>
                  </td>
                  <td class="name">{{item.name}}</td>
                  <td class="type">{{item.type}}</td>
                  <td>
                    <v-avatar size="24">
                      <img :src="require(`@/assets/img/platform/${item.platform}.svg`)" alt="">
                    </v-avatar>
                  </td>
                  <td>
                    <v-btn
                    class="white--text"
                      color="#9FA8DA"
                      :href="item.url"
                      target="_blank"
                    >
                      <v-icon>
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                  </td>
                  <td style="width: 96px;">{{item.note}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
  
        <v-snackbar
          v-model="snackbar"
          timeout="3000"
        >
          {{`更新时间： ${date}`}}
          <template v-slot:action>
            ⛄🎉
          </template>
        </v-snackbar>
    </div>
  </template>
  
  <script lang="ts">
  import Vue from 'vue'
  import data from './data'
  
  export default Vue.extend({
      name: 'Collect',
      data(){
        return {
          snackbar: true,
          titles: data.titles,
          items: data.items,
          date: data.date
        }
      }
  })
  </script>
  
  <style lang="scss" scoped>
    .rem {
      .name {
        font-weight: bold;
      }
      .type {
        font-weight: bold;
      }
    }
  </style>