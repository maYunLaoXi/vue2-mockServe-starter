<template>
  <div>
    <img v-for="item in data" :src="`https://photo.tuchong.com/${item.user_id}/l/${item.img_id}.webp`" :key="item.user_id + item.img_id_str" alt="">
  </div>
</template>
<script>
export default {
  name: 'ImgView',
  data() {
    return {
      data: []
    }
  },
  created() {
    this.data = this.$route.params
  }
}
</script>
<style lang="scss" scoped>
img{
  width: 100%;
}
</style>