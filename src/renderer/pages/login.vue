<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autoComplete="on"
      :model="loginForm"
      ref="loginForm"
      label-position="left"
    >
      <h2 class="title">考试系统</h2>
      <el-form-item prop="username">
        <el-input
          name="username"
          type="text"
          prefix-icon="el-icon-user"
          v-model="loginForm.username"
          autoComplete="on"
          placeholder="学号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          name="password"
          :type="pwdType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autoComplete="on"
          placeholder="密码"
        ></el-input>
        <span class="show-pwd" @click="showPwd"
          ><svg-icon icon-class="eye"
        /></span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width: 100%"
          :loading="loading"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form-item>
      <div class="tips">
        <span style="margin-right: 20px">用户名: 学号</span>
        <span> 密码: 学号</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "2020414315",
        password: "Ll010705",
      },
      loading: false,
      pwdType: "password",
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    async handleLogin() {
      this.loading = true;
      const res = await this.$store.dispatch("Login", this.loginForm);
      if (res == 2000) {
        this.loading = false;
        this.$message({
          message: "登陆成功",
          type: "success",
        });
        this.$router.push({ path: "/examination" });
      } else if (res == 400) {
        this.loading = false;
        this.$message.error("账号或密码错误");
      }
    },
  },
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 36px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
