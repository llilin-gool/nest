<template>
  <div>

    <el-menu class="el-menu-demo"
             mode="horizontal"
             background-color="#545c64"
             text-color="white">
      <el-menu-item>曲小园 软件工程1班</el-menu-item>
      <el-menu-item>
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
      </el-menu-item>
      <el-menu-item>倒计时：{{m}} : {{s}}</el-menu-item>
      <el-menu-item class="prompt"
                    @click="prompt">提示</el-menu-item>
    </el-menu>
    <p>AAAAA</p>
    <div class="Date">
      <p class="date">{{h}}</p>
      <p>:</p>
      <p class="date">{{m}}</p>
      <p>:</p>
      <p class="date">{{s}}</p>
    </div>
  </div>
</template>
<script>
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
export default {
  name: 'Date',

  data () {
    return {
      d: '',
      h: '',
      m: '',
      s: '',
    };
  },
  created () {
    this.countTime()
  },
  methods: {
    prompt () {
      this.$alert('这是一段内容，暂无提示', '提示', {
        confirmButtonText: '确定',

      });
    },
    countTime: function () {
      //获取当前时间
      var date = new Date()
      var now = date.getTime()
      //设置截止时间
      var endDate = new Date('2022-3-29 23:23:23')
      var end = endDate.getTime()
      //时间差
      var leftTime = end - now
      //定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24)//天数我没用到，暂且写上
        this.h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
        this.m = Math.floor((leftTime / 1000 / 60) % 60)
        this.s = Math.floor((leftTime / 1000) % 60)
      }
      console.log(this.s)
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(this.countTime, 1000)
    },
  },


}
</script>
<style>
.prompt {
  position: relative;
  left: 70%;
}
</style>