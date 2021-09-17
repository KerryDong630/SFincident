<template>
  <el-container>
    <el-header style="line-height: 60px">消息维护</el-header>
    <el-main>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2 }"
        placeholder="请输入消息内容"
        v-model="result.des"
      >
      </el-input>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="postData">提交</el-button>
      <el-button @click="onCancle">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { postAlter } from "@/api/program";
export default {
  data() {
    return {
      result: {
        des: "",
      },
    };
  },
  created() {},
  methods: {
      onCancle(){

      },
    postData() {
      postAlter(this.result).then((res) => {
        this.$notify({
          title: "Success",
          message: "提交成功",
          type: "success",
        });
      });
    },
  },
};
</script>

<style>
</style>