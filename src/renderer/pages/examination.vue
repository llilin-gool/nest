<template>
  <div>
    <el-menu class="el-menu-demo"
             mode="horizontal"
             background-color="#545c64"
             text-color="white">
      <el-menu-item style="word-spacing:10px">{{ this.userInfo.nickname}} {{ this.userInfo.office }}</el-menu-item>
      <el-menu-item>
        <el-avatar :src=userInfo.avatar></el-avatar>
      </el-menu-item>
      <el-menu-item>倒计时：{{h}}：{{m}} : {{s}}</el-menu-item>
      <el-menu-item class="prompt"
                    @click="prompt">提示</el-menu-item>
      <el-menu-item>科目：计算机组成原理 半期考试</el-menu-item>
    </el-menu>

    <el-container>
      <el-aside width="50%">
        <div style="padding-top:8px;padding-left:30px">
          <el-tag type="info"
                  size="medium">
            1、单选
          </el-tag>
        </div>
        <hr />
        <!-- 题干区域 -->
        <div style="padding-left:30px">
          <p>1.9计算机互联的主要目的是（ ）</p>
        </div>
      </el-aside>
      <el-main>
        <!-- 作答区域 -->
        <!-- 单选 -->
        <el-radio-group v-if="questionType==='单选'"
                        v-model="form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
          <el-radio label="线上品牌赞助"></el-radio>
          <el-radio label="线场地免费"></el-radio>
        </el-radio-group>
        <!-- 多选 -->
        <el-checkbox-group v-if="questionType==='多选'"
                           v-model="checklist">
          <el-checkbox label="线上品牌商赞助"></el-checkbox>
          <el-checkbox label="线下场地免费"></el-checkbox>
          <el-checkbox label="线上品牌赞助"></el-checkbox>
          <el-checkbox label="线场地免费"></el-checkbox>
          <!-- <el-checkbox label="禁用"
                       disabled></el-checkbox>
          <el-checkbox label="选中且禁用"
                       disabled></el-checkbox> -->
        </el-checkbox-group>

        <!-- 判断题 -->
        <el-radio-group v-if="questionType==='判断'"
                        v-model="form.resource">
          <el-radio label="对"></el-radio>
          <el-radio label="错"></el-radio>
        </el-radio-group>
        <!-- 解答题 -->
        <AnswerVditor v-if="questionType==='解答'"
                      v-model="questionType"></AnswerVditor>

        <!-- 编程题 -->
        <div v-if="questionType==='编程'">
          <mavon-editor :defaultOpen="`edit`"
                        :boxShadow="false"
                        :autofocus="false"
                        style="
                    z-index: 1;
                    border: 1px solid #d9d9d9;
                    min-height: 87vh;
                  "
                        class="fit"
                        :toolbarsFlag="false"
                        v-model="code"
                        placeholder="请在此输入源代码（Java类名需要为Main）">
          </mavon-editor>
        </div>
      </el-main>
    </el-container>
    <el-footer>
      <el-row>
        <el-button-group>
          <el-button type="primary"
                     icon="el-icon-arrow-left">上一题</el-button>
          <el-button type="primary">下一题<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>
        <el-button style="margin-left:2rem; margin-top:7px"
                   type="primary">题目列表</el-button>

        <el-select v-if="questionType==='编程'"
                   style="margin-top:7px"
                   v-model="select"
                   placeholder="请选择">
          <el-option label="C"
                     value="C"></el-option>
          <el-option label="C++"
                     value="C++"></el-option>
          <el-option label="Java"
                     value="Java"></el-option>
          <el-option label="Python"
                     value="Python"></el-option>

        </el-select>

        <el-button class="infoWin"
                   type="primary"
                   @click="onSubmit">提交</el-button>
      </el-row>

    </el-footer>

    <!-- <div class="Date"> -->
    <!-- <p class="date">{{h}}</p>
      <p>:</p>
      <p class="date">{{m}}</p>
      <p>:</p>
      <p class="date">{{s}}</p> -->
    <!-- </div> -->
  </div>
</template>
<script>
import AnswerVditor from "../pages/AnsweVditor.vue"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
export default {
  components: {
    AnswerVditor
  },
  name: 'Date',

  data () {
    return {
      d: '',
      h: '',
      m: '',
      s: '',
      // 单选框的值
      form: {
        resource: ''
      },
      // 问题的类型 暂时使用
      questionType: "编程",
      // 多选框的值 是一个数组
      checklist: [],
      userInfo: [],
      code: "",
      select: ""
    };
  },
  created () {
    this.countTime()
    this.$store.dispatch("GetUserInfo")
    this.handleUserInfo()

  },
  methods: {
    onSubmit () {
      // console.log(this.form);
      console.log(this.code, this.select);
    },
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
      var endDate = new Date('2022-4-29 00:23:23')
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
      // console.log(this.s)
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(this.countTime, 1000)
    },
    //进入页面获取当前页面的用户信息
    handleUserInfo () {
      this.userInfo = this.$store.state.user
      console.log("AAAA");
      console.log(this.userInfo);
    }
  },
}
</script>
<style>
.prompt {
  position: fixed;
  right: 5rem;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  /* text-align: center; */
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  /* text-align: center; */
  /* line-height: 70 */
  height: 41rem;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  /* line-height: 0; */
  height: 41rem;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.el-radio {
  display: block;
  line-height: 23px;
  white-space: normal;
  margin-right: 0;
  font-size: 10px !important;
  line-height: 60px;
  top: 30px;
  left: 30px;
}
.el-checkbox {
  display: block;
  line-height: 23px;
  white-space: normal;
  margin-right: 0;
  font-size: 10px !important;
  line-height: 60px;
  top: 30px;
  left: 20px;
}
.el-radio__label {
  font-size: 20px;
}
.el-checkbox__label {
  font-size: 20px;
}
.infoWin {
  position: fixed;
  right: 60px;
  bottom: 5px;
  width: 90px;
  height: 35px;
}
</style>