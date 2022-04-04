<template>
  <div v-loading="isloading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <!-- 考试科目选择弹窗 -->
    <el-dialog v-model="dialogChooseExam"
               title="考试科目选择"
               :visible.sync="dialogChooseExam">
      <el-form :model="chooseExamOpt">
        <el-form-item label="考试科目"
                      :label-width="formLabelWidth">
          <el-select v-model="chooseExamOpt.tempOpt"
                     placeholder="请选择考试科目">
            <el-option v-for="(item, index) in courseList"
                       :key="index"
                       :label="item.name"
                       :value="item.name"></el-option>
            <!-- <el-option label="区域二"
                       value="beijing"></el-option> -->
          </el-select>
          <el-select v-model="chooseExamOpt.tempTerm"
                     placeholder="请选择考试类型">
            <el-option label="期中考试"
                       value="期中考试"></el-option>

            <el-option label="期末考试"
                       value="期末考试"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogChooseExam = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogChooseExam = false,
                   chooseExamOpt.term=chooseExamOpt.tempTerm,
                   chooseExamOpt.opt=chooseExamOpt.tempOpt,
                   handleGetHomeworks()
              
                   ">确 定</el-button>
      </div>
    </el-dialog>

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
      <el-menu-item @click="dialogChooseExam=true">科目：{{ chooseExamOpt.opt? chooseExamOpt.opt:"请选择考试科目！" }} {{ chooseExamOpt.term? chooseExamOpt.term:"" }}</el-menu-item>
    </el-menu>

    <el-container>
      <el-aside width="40%">
        <!-- <div style="padding-top:8px;padding-left:30px">
          <el-tag type="info"
                  size="medium">
            1、单选
          </el-tag>
        </div>
        <hr /> -->
        <!-- 题干区域 -->
        <!-- <div style="padding-left:30px">
          <p>1.9计算机互联的主要目的是（ ）</p>
        </div> -->
        <ViewVditor :content="
                  questionDetail.type == '编程'
                    ? markdownToHtml(questionDetail.content)
                    : questionDetail.content
                "
                    :questionMeta="`${questionDetail.index}、${questionDetail.type}`"></ViewVditor>
      </el-aside>
      <el-main>
        <!-- 作答区域 -->
        <!-- 单选  和  判断 -->
        <el-radio-group v-if="
                       questionDetail.type==='单选' ||
                       questionDetail.type==='判断'"
                        v-model="questionDetail.radioAnswer"
                        v-for="(item,index) in questionDetail.answer"
                        :key="index">
          <!-- <el-radio :label="item.mark+' '+item.content"
                    :value="item.mark"></el-radio> -->
          <el-radio :label="item.mark"
                    v-if="item.content.trim() != ''">
            <div v-html="markdownToHtml(item.mark + '、' + item.content)
                          "></div>
          </el-radio>

        </el-radio-group>
        <!-- 多选 -->
        <div v-if="questionDetail.type==='多选'"
             v-for="(item,index) in questionDetail.answer"
             :key="index">
          <el-checkbox @change="item.isCorrect = !item.isCorrect">
            <div v-html="markdownToHtml(item.mark + '、' + item.content)
                          "></div>
          </el-checkbox>

          <!-- <el-checkbox label="禁用"
                       disabled></el-checkbox>
          <el-checkbox label="选中且禁用"
                       disabled></el-checkbox> -->
        </div>
        <!-- 填空题 -->
        <div v-if="questionDetail.type === '填空'">
          <el-form>
            <el-input v-for="(item, index) in questionDetail.answer"
                      :key="index"
                      :placeholder="'第' + (index + 1) + '空'"
                      v-model="item.content" />
          </el-form>
        </div>
        <!-- 解答题 -->
        <div v-if="questionDetail.type === '解答' && !isEnd"
             @click="activedEditor = questionDetail._id">
          <AnswerVditor v-model="questionDetail.answer[0].content"></AnswerVditor>
        </div>

        <div v-if="
                  questionDetail.type === '解答' &&
                  isEnd &&
                  Object.getOwnPropertyNames(questionDetail.studentQA[0]).length <= 1
                "
             @click="activedEditor = questionDetail._id">
          <div style="
                    background: red;
                    color: white;
                    position: absolute;
                    top: 5%;
                    left: 5%;
                  ">
            未作答
          </div>
        </div>
        <!-- 编程题 -->
        <div v-if="questionDetail.type==='编程'"
             @click="activedEditor = questionDetail._id">
          <mavon-editor :defaultOpen="`edit`"
                        :boxShadow="false"
                        :autofocus="false"
                        :ref="activedEditor"
                        style="
                    z-index: 1;
                    border: 1px solid #d9d9d9;
                    min-height: 87vh;
                  "
                        class="fit"
                        :toolbarsFlag="false"
                        v-model="questionDetail.answer[0].content"
                        placeholder="请在此输入源代码（Java类名需要为Main）">
          </mavon-editor>
        </div>
      </el-main>
    </el-container>
    <el-footer>
      <el-row>
        <el-button-group>
          <el-button type="primary"
                     icon="el-icon-arrow-left"
                     @click="switchQuestion('right')">上一题</el-button>
          <el-button type="primary"
                     @click="switchQuestion('left')">下一题<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>
        <el-button style="margin-left:2rem; margin-top:7px"
                   type="primary">题目列表</el-button>

        <el-select v-if="questionDetail.type==='编程'"
                   v-model="optLanguageType"
                   placeholder="请选择">
          <el-option v-for="(item, index) in languageTypeList"
                     :key="index"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>

        <el-button class="infoWin"
                   type="primary"
                   @click="handlePostAnswerForQuestion()">提交</el-button>
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
import AnswerVditor from "../pages/AnsweVditor.vue";
import ViewVditor from "../pages/ViewVditor.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
  getCourse,
  getHomeworks,
  getHomeworkInfo,
} from "../api/user/index";
import { marked } from "marked";
//提交请求api
import {
  postAnswerForQuestion,
  postAnswerForOJQuestion,
} from "../api/user/index";
export default {
  components: {
    AnswerVditor,
    ViewVditor

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
      questionType: "单选",
      // 多选框的值 是一个数组
      checklist: [],
      userInfo: [],
      code: "",
      select: "",
      courseList: [],
      dialogChooseExam: false,
      formLabelWidth: '120px',
      chooseExamOpt: {
        opt: "",
        term: "",
        number: "",
        tempOpt: "",
        tempTerm: "",
        tcc_id: "",
      },
      isEnd: "",
      homework: "",
      questionDetail: { answer: [{ content: "" }] },
      countQuestionType: {
        单选: 0,
        多选: 0,
        判断: 0,
        填空: 0,
        解答: 0,
        编程: 0,
      },
      homeworkInfoId: "",
      activedEditor: "",
      //编程题语言选择
      languageTypeList: [
        {
          label: "C",
          value: "c_lang_config",
        },
        {
          label: "C++",
          value: "cpp_lang_config",
        },
        {
          label: "Java",
          value: "java_lang_config",
        },
        {
          label: "Python2",
          value: "py2_lang_config",
        },
        {
          label: "Python3",
          value: "py3_lang_config",
        },
        {
          label: "Go",
          value: "go_lang_config",
        },
      ],
      optLanguageType: "",  //选择后的编程语言
      flag: true,
      isloading: false
    };
  },
  created () {
    this.countTime()
    this.$store.dispatch("GetUserInfo")
    this.handleUserInfo()
    this.handleGetAllCourse()
  },
  methods: {
    //答案提交请求
    async handlePostAnswerForQuestion () {
      //当前为编程题
      if (this.questionDetail.type === "编程") {
        if (this.optLanguageType === "") {
          this.$message({
            showClose: true,
            message: '请先选择编程语言！',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        if (this.questionDetail.answer[0].content.trim() === "") {
          this.$message({
            showClose: true,
            message: '请输入源代码',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        let res = await postAnswerForOJQuestion({
          question_id: this.questionDetail._id,
          questionSet_id: this.questionDetail.questionSet_id,
          homework_id: this.homework._id,
          src: this.questionDetail.answer[0].content,
          language_config: this.optLanguageType,
          test_case_id: this.questionDetail.test_case_id,
        });
        if (res.data.code === 2000) {
          if (res.data.data.code === 4000) {
            this.$message({
              showClose: true,
              message: res.data.data.msg,
              type: 'warning',
              duration: 2000
            });
            return;
          }
          this.questionDetail.studentQA.push({});
          this.questionDetail.studentQA[0].score = res.data.data.finalScore;
          this.questionDetail.isAnswer = true;
          this.$message({
            showClose: true,
            message: '提交成功',
            type: 'success',
            duration: 1000
          });
        }

        return;
      }
      //构造提交答案模板
      let req = {
        question_id: this.questionDetail._id, // 题目id
        homework_id: this.homework._id, //作业id
        questionSet_id: this.questionDetail.questionSet_id, // 试题集id
        stuAnswer: [], //上传的答案
      };
      if (this.questionDetail.type === "解答") {
        //解答题
        if (this.questionDetail.answer[0].content.trim() === "") {
          this.$message({
            showClose: true,
            message: '请输入答案后再提交',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        req.stuAnswer.push({ content: this.questionDetail.answer[0].content });
      } else if (this.questionDetail.type === "填空") {
        //填空题
        this.questionDetail.answer.forEach((element, index) => {

          if (element.content.trim() === "") {
            this.$message({
              showClose: true,
              message: '请输入答案后再提交',
              type: 'warning',
              duration: 2000
            });
            return;
          }
          req.stuAnswer.push({
            mark: index + 1,
            explain: "",
            content: element.content,
          });
        });
      } else if (
        //单选题或判断题
        this.questionDetail.type === "判断" ||
        this.questionDetail.type === "单选"
      ) {
        if (this.questionDetail.radioAnswer === "") {
          this.$message({
            showClose: true,
            message: '请输入答案后再提交',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        req.stuAnswer.push({
          mark: this.questionDetail.radioAnswer,
        });
      } else if (this.questionDetail.type === "多选") {
        //多选题
        this.questionDetail.answer.forEach((element) => {
          if (element.isCorrect) {
            req.stuAnswer.push({
              mark: element.mark,
              explain: element.explain,
              content: element.content,
            });
          }
        });
        if (req.stuAnswer.length < 2) {

          this.$message({
            showClose: true,
            message: '多选题至少有两个正确答案',
            type: 'warning',
            duration: 2000
          });
          return;
        }
      }

      //发送请求
      let res = await postAnswerForQuestion(req);

      if (res.data.code === 2000) {
        this.questionDetail.isAnswer = true;
        if (this.flag == true) {
          if (this.questionDetail.index < this.homework.questionList.length) {
            //跳转到下一题
            if (
              this.homework.questionList[this.questionDetail.index].isAnswer ===
              false
            ) {
              this.switchQuestion("left");
            }
          }
        }
        // 全局加载 限制操作

        this.isloading = true
        var timer = setTimeout(() => {

          timer = void 0;
        }, 1000);

        this.isloading = false
        this.$message({
          showClose: true,
          message: '提交成功',
          type: 'success',
          duration: 1000
        });
      }
    },
    // testclg () {
    //   console.log(this.questionDetail);
    // },
    // 登录后就要求用户选择考试的科目
    onSubmit () {
      // console.log(this.form);
      // console.log(this.code, this.select);
      console.log(this.optLanguageType);
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
    },

    //获取所有课程
    async handleGetAllCourse () {
      let res = await getCourse();
      if (res.data.code === 2000) {
        this.courseList = res.data.data.map((item) => {
          item.course.tcc_id = item._id;
          item.course.name =
            item.course.name + "（" + item.teacher.user.nickname + "）";
          return item.course;
        });
      }
      console.log("所有课程");
      console.log(this.courseList);
    },
    //获取课程作业信息
    async handleGetHomeworks () {
      this.courseList.map((item) => {
        if (this.chooseExamOpt.opt == item.name) {
          this.chooseExamOpt.tcc_id = item.tcc_id;
        }
      })
      let res = await getHomeworks({
        tcc_id: this.chooseExamOpt.tcc_id,
        //  category: this.chooseExamOpt.opt,   测试携程课程设计  记得改回来
        category: '课程设计',
      });
      var randomnum;
      if (res.data.code == 2000) {
        // 试卷乱序 获取到试卷的id 随机选出一个作为考试内容
        if (res.data.data.length > 1) {
          randomnum = Math.round(Math.random() * (res.data.data.length - 1))
          console.log(res.data.data[randomnum].id);
          this.homeworkInfoId = res.data.data[randomnum].id;
        } else {
          this.homeworkInfoId = res.data.data[0].id;
        }
        this.handleGetHomeworkInfo()
      }
    },
    //获取作业详细信息
    async handleGetHomeworkInfo () {
      //加 加载效果
      let res = await getHomeworkInfo(this.homeworkInfoId);
      if (res.data.code === 2000) {
        let data = res.data.data;
        this.isEnd = data.isEnd;
        //过滤试题集形成题目列表
        let questions = [];
        data.questionSets.forEach((element) => {
          questions = questions.concat(
            element.questions.map((item) => {
              item.radioAnswer = "";
              item.questionSet_id = element._id;
              return item;
            })
          );
        });
        //题目乱序
        for (var i = 0; i < questions.length; i++) {
          var iRand = parseInt(questions.length * Math.random());
          // console.log(iRand);
          var temp = questions[i];
          questions[i] = questions[iRand];
          questions[iRand] = temp;
        }
        //题目排序
        let dataTempList = [];
        questions.forEach((item) => {
          this.countQuestionType[item.type]++;
          if (item.type === "单选") {
            dataTempList.push(item);
          }
        });
        questions.forEach((item) => {
          if (item.type === "多选") {
            dataTempList.push(item);
          }
        });
        questions.forEach((item) => {
          if (item.type === "判断") {
            dataTempList.push(item);
          }
        });
        questions.forEach((item) => {
          if (item.type === "填空") {
            dataTempList.push(item);
          }
        });
        questions.forEach((item) => {
          if (item.type === "解答") {
            dataTempList.push(item);
          }
        });
        questions.forEach((item) => {
          if (item.type === "编程") {
            item.answer.push({
              content: "",
              explain: "",
              mark: "参考答案",
            });
            item.content =
              item.title +
              item.description +
              item.input_description +
              item.output_description;
            dataTempList.push(item);
          }
        });
        questions = dataTempList;

        questions.forEach((element, index) => {
          element.index = index + 1; //记录题目序号
          if (element.studentQA.length != 0) {
            //学生已作答
            element.isAnswer = true; //标记此题已作答
            if (element.type === "填空" || element.type === "解答") {
              //填空题和解答题处理
              element.answer = element.studentQA[0].stuAnswer;
            } else if (element.type === "编程") {
              element.answer =
                element.studentQA[0].stuAnswer.length > 0
                  ? element.studentQA[0].stuAnswer
                  : [
                    {
                      content: "",
                      explain: "",
                      mark: "参考答案",
                    },
                  ];
            } else if (element.type === "多选") {
              //多选题处理
              element.answer.forEach((element2) => {
                element2.isCorrect = false;
                element.studentQA[0].stuAnswer.forEach((element3) => {
                  if (element3.mark === element2.mark) {
                    element2.isCorrect = true;
                  }
                });
              });
            } else {
              //单选和判断处理
              element.radioAnswer = element.studentQA[0].stuAnswer[0].mark;
            }
          } else {
            //学生未作答
            element.isAnswer = false;
            //对多选题增加isCorrect字段
            if (element.type === "多选") {
              element.answer.forEach((element2) => {
                element2.isCorrect = false;
              });
            }
          }
        });
        data.questionList = questions;
        data.questionsNum = questions.length;
        this.homework = data;

        this.homework.questionList.forEach((element) => {
          //判断关键字是否存在
          if (element.studentQA.length == 0) {
            element.studentQA[0] = { comment: "" };
          }
          if (!element.studentQA[0].comment) {
            element.studentQA[0].comment = "";
          }
        });
        // console.log(this.homework.questionList[0].studentQA[0]['comment']);
        this.questionDetail = this.homework.questionList[0];
        // console.log(this.questionDetail)

      } else {
        this.$alert('这是一段内容，暂无提示', '提示', {
          confirmButtonText: '确定',

        });
      }
      console.log("这个是homework");
      console.log(this.homework);
      console.log("这个是questionDetail");
      console.log(this.questionDetail);
    },

    //切换题目
    switchQuestion (direction) {
      // console.log(this.questionDetail);
      // console.log(info);
      if (direction === "left") {
        if (this.questionDetail.index === this.homework.questionList.length) {
          this.$message({
            showClose: true,
            message: '当前已是最后一题',
            type: 'warning',
            duration: 2000
          });
          return;
        }

        this.questionDetail =
          this.homework.questionList[
          this.questionDetail.index === this.homework.questionList.length
            ? this.questionDetail.index - 1
            : this.questionDetail.index
          ];
      } else if (direction === "right") {
        if (this.questionDetail.index - 2 < 0) {
          this.$message({
            showClose: true,
            message: '当前已是第一题',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        this.questionDetail =
          this.homework.questionList[
          this.questionDetail.index - 2 < 0
            ? this.questionDetail.index - 1
            : this.questionDetail.index - 2
          ];
      }
    },
    //markdown解析器
    markdownToHtml (value) {
      return marked(value);
    },

  }
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
  /* width: 40rem; */
}
.el-radio div {
  display: block;
  float: right;
  margin-top: -20px;
  padding-left: 20px;
  width: 30rem;
}
/* ::v-deep .el-radio {
  display: block;
  padding: 100px, 0;
  margin: 10px 0;
} */
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