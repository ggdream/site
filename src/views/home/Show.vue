<template>
<img :src="url" alt="" class="show">
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
    name: 'Show',
    props: {
        url: {
            type: String,
            required: true,
        }
    }
})
</script>

<style scoped lang="scss">
.show {
    width: 100%;
    height: 64vh;
    margin: 5vh 0;
}
</style>