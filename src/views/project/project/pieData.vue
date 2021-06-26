<template>
  <el-container>
    <el-header style="line-height: 60px">关键数据维护 </el-header>
    <el-main>
      <el-table stripe :data="response" style="margin-top: 20px">
        <el-table-column label="类型" prop="data_type" key="data_type">
        </el-table-column>
        <el-table-column label="个数" prop="count" key="count">
          <template slot-scope="scope">
            <el-input v-model="scope.row.count"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onCancle">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { getMainData, putMainData } from "@/api/project";

export default {
  data() {
    return {
      response: null,
      //   datalist: [
      //     {
      //       type: "已到件总数",
      //       count: "",
      //     },
      //     { type: "已完成", count: "" },
      //     { type: "实施中", count: "" },
      //     { type: "问题项", count: "" },
      //     { type: "需委托方协商解决", count: "" },
      //     { type: "待目击", count: "" },
      //     { type: "内部原因暂停", count: "" },
      //     { type: "通过目击吸湿中-未平衡", count: "" },
      //     { type: "通过目击吸湿中-已平衡", count: "" },
      //     { type: "常温实施中", count: "" },
      //   ],
    };
  },
  created() {
    this.getMainData();
  },
  methods: {
    onSubmit: function () {
      this.$confirm("确定提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = {
            data: this.response,
          };
          putMainData(data).then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: "提交成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交",
          });
        });
    },
    onCancle: function () {},
    getMainData: function () {
      getMainData().then((response) => {
        this.response = response;
        console.log(this.response);
      });
    },
  },
};
</script>

<style>
</style>