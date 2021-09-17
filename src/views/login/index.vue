<template>
  <div class="login-container">
    <el-form
      v-if="!ifChange"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">先进材料结构实验室试验件平台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >

      <div class="tips">
        <span style="margin-right: 20px"
          >如果忘了密码，请联系超级管理员更改密码</span
        >
        <span
          @click="changePwd"
          v-on:mouseover="changeActive($event)"
          v-on:mouseout="removeActive($event)"
          class="changeRouter"
          >更改密码
        </span>
        
      </div>
    
    </el-form>

    <el-form
      status-icon
      ref="loginForm"
      :model="loginForm"
      v-if="ifChange"
      
      class="login-form"
      :rules="loginRules"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">中国商飞北研中心</h3>
         <h3 class="title">第一次登录请重置密码</h3>
      </div>
      <el-form-item  prop="pass">
        <el-input
          :key="passwordType"
          ref="pass"
          v-model="loginForm.pass"
          :type="passwordType"
          placeholder="新密码"
          tabindex="2"
          auto-complete="on"
        />
        <!-- <el-input
          type="password"
          v-model="loginForm.pass"
          autocomplete="off"
        ></el-input> -->

        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item  prop="checkPass">
        <!-- <el-input
          type="password"
          v-model="loginForm.checkPass"
          autocomplete="off"
        ></el-input> -->
        <el-input
          :key="passwordType"
          ref="checkPass"
          v-model="loginForm.checkPass"
          :type="passwordType"
          placeholder="确认密码"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="submitCPwd"
        >确认修改</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { login, logout, getInfo } from "@/api/user";
import { changeUser } from "@/api/user";
import { Message } from 'element-ui';
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    const confirmPassword = (rule, value, callback) => {
      if (value !== this.loginForm.npassword) {
        callback(new Error("和新密码保持一致"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
     if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.loginForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "admin",
      },
      loginRules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        npassword: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        cpassword: [
          { required: true, trigger: "blur", validator: confirmPassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      ifChange: false,
    };
  },
  created() {},
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    submitCPwd() {
      changeUser(this.loginForm.username, {
        password: this.loginForm.pass,
        u_status: 1,
      }).then((response) => {
        //this.logout();
        this.$router.go(0);
        //location.reload(true)
      });
    },
    changeActive($event) {
      $event.currentTarget.className = "active changeRouter";
    },
    removeActive($event) {
      $event.currentTarget.className = "noactive changeRouter";
    },
    changePwd() {
      this.ifChange = true;
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    checkStatus(username) {
      return new Promise((resolve, reject) => {
        getInfo(username).then((response) => {
          resolve(response.u_status);
        });
      });
    },
    handleLogin() {
      var valid = true;
      //check status
      var username = this.loginForm.username;
      this.checkStatus(username).then((data) => {
        if (data == 0) {
          console.log("首次登录");
          this.ifChange = true;
          //this.$router.push({path:"/changepwd"})
        } else {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("user/login", this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || "/" });
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            //Message.error('用户名密码错误')
            console.log("登录错误");
            return false;
          }
        }
      });
      // this.$refs.loginForm.validate((valid) => {

      // });
    },
  },
};
</script>

<style lang="scss">
.active {
  cursor: pointer;
}
.noactive {
  cursor: auto;
}
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
  }
  .changeRouter {
    display: inline-block;
    float: right;
    color: #409eff;
  }
  .title-container {
    position: relative;

    .title {
      font-size: 50px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
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
