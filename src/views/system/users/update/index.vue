<template>
  <el-container>
    <el-header style="line-height: 60px">编辑用户 </el-header>
    <el-main>
      <label>用户详细信息</label>
      <el-form label-width="80px" class="main-form">
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="用户名">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="工号">
              <el-input v-model="form.u_id"></el-input>
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

      <el-checkbox-group
        class="check-group"
        v-model="checkedRoles"
      >
        <el-checkbox v-for="role in rolesOption" :label="role" :key="role">{{
          role
        }}</el-checkbox>
      </el-checkbox-group>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="onSubmit">立刻更新</el-button>
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

import { getUser,putUser } from "@/api/user";

export default {
  data() {
    return {
      username: "",
      roles,
      rolesOption,
      checkedCities: [],
      checkedRoles: [],
      form: {},
    };
  },
  mounted: function () {
    this.username = this.$route.query.username;
    this.getList(this.username);
  },
  methods: {
    onSubmit() {
      var arr = this.checkedRoles.concat();
      var str = arr.map(e=>{
        return this.roles[e]
      });
      this.form.u_authority = str.join(",")
      console.log(this.form);
      putUser(this.form).then((response) => {
         this.$notify({
          title: "Success",
          message: "Update Successfully",
          type: "success",
        });
        this.$router.push("/users");
      })
    },
    // handleCheckedChange(value) {
    //   this.form["u_authority"] = [];
    //   var that = this;
    //   for (var k in value) {
    //     this.roles.forEach(function (e) {
    //       if (e.name == value[k]) {
    //         that.form.u_authority.push(e.key);
    //       }
    //     });
    //   }
    //   console.log(that.form.u_authority);
    // },
    getList(id) {
      getUser(id).then((response) => {
        // this.dialogFormVisible = false;

        this.form = response;
        console.log(this.form);
        this.checkedRoles = this.form.u_authority.split(",").map((element) => {
          for (var k in this.roles) {
            if (roles[k] == element) {
              return k;
            }
          }
        });
        //this.checkedRoles = this.form.u_authority.split(",");
        console.log(this.checkedRoles);
      });
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