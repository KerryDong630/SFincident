<template>
  <el-container>
    <el-header style="line-height: 60px">新建项目</el-header>
    <el-main>
      <label>{{ form1.label }}</label>
      <el-form
        class="demo-form-inline main-form"
        style="margin-top: 20px"
        :model="formData"
        ref="formData"
        :rules="formRules"
      >
        <el-row :gutter="40">
          <el-col
            v-for="item in form1.data"
            :key="item.name"
            :xs="12"
            :sm="12"
            :lg="8"
          >
            <el-form-item :label="item.name" :prop="item.key">
              <el-input
                v-model="formData[item.key]"
                :rules="item.rules"
                v-if="item.key !== 'res_name' && item.key !== 'finish_time'"
              ></el-input>
              <el-select
                placeholder="实验主管"
                clearable
                style="width: 100%"
                v-model="formData[item.key]"
                v-if="item.key == 'res_name'"
                class="filter-item"
              >
                <el-option
                  v-for="item in users"
                  :key="item.username"
                  :label="item.u_name"
                  :value="item.username"
                >
                  <span style="float: left">{{ item.u_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.username
                  }}</span>
                </el-option>
              </el-select>
              <el-date-picker
                v-if="item.key == 'finish_time'"
                type="date"
                format="yyyyMMdd"
                value-format="yyyyMMdd"
                placeholder="选择日期"
                v-model="formData[item.key]"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <label>{{ form2.label }}</label>
      <el-form
        class="demo-form-inline main-form"
        :model="formData"
        ref="formData"
        :rules="formRules"
        style="margin-top: 20px"
      >
        <el-row :gutter="40">
          <el-col
            v-for="item in form2.data"
            :key="item.name"
            :xs="12"
            :sm="12"
            :lg="8"
          >
            <el-form-item :label="item.name" :prop="item.key">
              <el-input v-model="formData[item.key]"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tool-button">
        <!-- <el-button @click="downLoad">下载检查单</el-button>
        <el-button @click="upLoad">上传签字检查单</el-button> -->
      </div>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onCancle">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import store from "../../../../store";
import { addProject } from "@/api/project";
import { getUsersList } from "@/api/user";
import { parseTime } from "@/utils";
export default {
  data() {
    return {
      temp: {},
      users: null,
      formRules: {
        pro_name: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        res_name: [
          { required: true, message: "实验主管不能为空", trigger: "blur" },
        ],
        finish_time: [
          { required: true, message: "计划时间不能为空", trigger: "blur" },
        ],
        company: [
          { required: true, message: "委托公司不能为空", trigger: "blur" },
        ],
        category: [
          { required: true, message: "行业不能为空", trigger: "blur" },
        ],
        u_email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        postcode: [
          { required: false, message: "请输入邮编地址", trigger: "blur" },
           { min: 6, max: 6, message: "请输入正确的邮编地址", trigger: "blur" },
          {
            pattern: /^[0-9]{6}$/,
            message: "请输入正确的邮编地址",
          },
        ],
        tele_phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码",
          },
        ],
      },
      formData: {
        pro_name: "",
        res_name: "",
        finish_time: "",
        company: "",
        category: "",
        postcode: "",
        contact: "",
        u_email: "",
        tele_phone: "",
        address: "",
      },
      form1: {
        lable: "项目信息",
        data: [
          {
            name: "项目名称",
            force: true,
            value: "",
            key: "pro_name",
            rules: [],
          },
          {
            name: "试验主管",
            force: true,
            value: "",
            key: "res_name",
          },
          {
            name: "项目计划完成时间",
            force: true,
            value: "",
            key: "finish_time",
          },
        ],
      },
      form2: {
        lable: "客户信息",
        data: [
          {
            name: "委托方名称",
            force: true,
            value: "",
            key: "company",
          },
          {
            name: "行业类型",
            force: true,
            value: "",
            key: "category",
          },
          {
            name: "邮编",
            force: true,
            value: "",
            key: "postcode",
          },
          {
            name: "联系人",
            force: true,
            value: "",
            key: "contact",
          },
          {
            name: "邮箱",
            force: true,
            value: "",
            key: "u_email",
          },
          {
            name: "联系方式",
            force: true,
            value: "",
            key: "tele_phone",
          },
          {
            name: "详细地址",
            force: true,
            value: "",
            key: "address",
          },
        ],
      },
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    getUsersList() {
      getUsersList().then((response) => {
        console.log(response);
        this.users = response.data;
      });
    },
    upLoad() {},

    onSubmit() {
      // this.form1.data.forEach((element) => {
      //   this.temp[element["key"]] = element.value;
      // });
      // this.form2.data.forEach((element) => {
      //   this.temp[element["key"]] = element.value;
      // });
      this.temp = this.formData;
      this.temp["create_name"] = store.getters.name;
      //this.temp['create_time'] = parseTime(new Date(),'{y}{m}{d}')
      console.log(this.temp);
      addProject(this.temp).then(() => {
        // this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: "Created Successfully",
          type: "success",
        });
        this.$router.push("/projectList");
      });
    },
    onCancle() {
      this.$confirm("此操作将取消新建项目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push({ path: "/projectList" });
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
</style>