<template>
  <el-container>
    <el-header style="line-height: 60px">新建用户 </el-header>
    <el-main>
      <label>用户详细信息</label>
      <el-form label-width="80px" class="main-form">
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="用户名">
              <el-input v-model="form.username" placeholder="用户名保证唯一性"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="工号">
              <el-input v-model="form.u_id" placeholder="工号保证唯一性"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="部门">
              <el-select placeholder="请选择部门" v-model="form.u_department">
                <el-option label="采购中心" value="de1"></el-option>
                <el-option label="财务中心" value="de2"></el-option>
                <el-option label="信息技术中心" value="de3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="姓名">
              <el-input v-model="form.u_name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="电话">
              <el-input v-model="form.u_tele"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="邮箱">
              <el-input v-model="form.u_email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <label>用户权限</label>
      <el-checkbox-group class="check-group" v-model="checkRoles">
        <el-checkbox
          v-for="role in rolesOption"
          :label="role"
          :key="role"
          border
          >{{ role }}</el-checkbox
        >
      </el-checkbox-group>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onCancle">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
const rolesOption = [
  "仓库",
  "任务",
  "项目",
  "试验员",
  "实验室",
  "设备管理",
  "基础资料",
  "用户管理",
];
const roles = {
  仓库: "warehouse",
  任务: "program",
  项目: "project",
  试验员: "experimenter",
  实验室: "laboratory",
  设备管理: "equipment",
  基础资料: "information",
  用户管理: "admin",
};
import { addUser } from "@/api/user";
import { deepCopy } from "@/utils/index";
export default {
  data() {
    return {
      isIndeterminate: true,
      roles,
      rolesOption,
      checkRoles: [],
      temp: {},
      form: {
        username: "",
        u_id: "",
        u_password: "",
        u_authority: [],
        u_department: "",
        u_name: "",
        u_tele: "",
        u_email: "",
      },
    };
  },
  methods: {
    handleCheckedChange(value) {
      this.form["u_authority"] = [];
      var that = this;
      for (var k in value) {
        this.roles.forEach(function (e) {
          if (e.name == value[k]) {
            that.form.u_authority.push(e.key);
          }
        });
      }
      console.log(that.form.u_authority);
    },
    onSubmit() {
      var arr = this.checkRoles.concat();

      this.form["u_authority"] = arr.map((e) => {
        return this.roles[e];
      });

      this.temp = deepCopy(this.form);

      this.temp["u_password"] = '00000000'; //默认密码
      this.temp["u_authority"] = this.temp["u_authority"].join(",");
      console.log(this.temp);
      addUser(this.temp).then(() => {
        // this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: "Created Successfully",
          type: "success",
        });
        this.$router.push("/users");
      });
      // this.$axios.post('http://127.0.0.1:5000/users', this.temp, {
      //   headers: {
      //         "Access-Control-Allow-Origin": "*",
      //         "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      //         "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      //          "Content-Type": "application/json"
      //       }
      //     }).then(res => {
      //       console.log(res);
      //     }).catch(err => {
      //       console.log(err.response);
      //     });
      // this.$axios({
      //   method: "post",
      //   url: "http://127.0.0.1:5000/users",
      //   data: this.temp,

      //   responseType: "json",
      // }).then((res) => {
      //   console.log(res);
      // });
    },
    onCancle() {
      this.$confirm("此操作将取消新建账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push({ path: "/users" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
  },
};
</script>

<style>
.check-group {
  margin-top: 20px;
}
</style>