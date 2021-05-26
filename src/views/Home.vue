<template>
  <div ref="home" class="home">
    <div class="imglist">
      <img class="cover" :src="data.coverUrl" alt="">
      <div class="link">
        <router-link to="/about">关于</router-link>&nbsp;
        <router-link to="/force-mock">forceMock</router-link>
      </div>
      <div v-for="item in data.postList" :key="item.post_id" class="box">
        <img v-if="item.type !== 'text'" :src="item.cover_image_src" alt="" @click="toImgView(item)">
        <div v-else style="background: #808387;">
          <p class="text">{{ item.excerpt }}</p>
        </div>
        </div>
    </div>
    <p>下拉加载</p>
  </div>
</template>

<script>
import { getTagsPortral } from '@/api'
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
BScroll.use(Pullup)

export default {
  name: 'Home',
  data() {
    return {
      data: {},
      page: NaN
    }
  },
  created() {
    this.getImage({})
  },
  activated() {
    console.log('Home actived++++++++++++++')
  },
  methods: {
    async getImage(data) {
      const { page = 1, count = 20, order = 'weekly' } = data
      if (page === this.page) return
      await getTagsPortral({ page, count, order }).then(res => {
        this.page = page
        if (page === 1) this.data = res
        else {
          this.data.postList = [...this.data.postList, ...res.postList]
        }
        this.$nextTick(() => {
          console.log('nextTick')
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.home, {
              pullUpLoad: true,
              disableTouch: false,
              disableMouse: false,
              click: true,
              dblclick: { delay: 300 }
            })
            this.scroll.on('pullingUp', async () => {
              console.log('pullingUp')
              await this.getImage({ page: this.page + 1 })
              this.scroll.finishPullUp()
              this.scroll.refresh()
            })
          } else {
            this.scroll.refresh()
          }
        })
      })
    },
    toImgView(item){
      console.log('click image')
      this.$router.push({ name: 'Image', params: item.images })
    },
    getUser() {
    },
    post() {
    }
  }
};
</script>
<style lang="scss" scoped>
.home{
  height: 100%;
}
.cover{
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.link{
  height: 40px;
}
.imglist{
  .box{
    display: inline-block;
    width: 50%;
    img{
      width: 100%;
    }
    .text{
      color: #bcbfc1;
      font-size: 10px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
  height: 100vh;
}
#app{
  height: 100%;
}
</style>
