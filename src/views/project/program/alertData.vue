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
      <div class="tool-button" style="margin-top: 20px">
        <el-button type="primary" @click="postData">提交</el-button>
        <el-button @click="onCancle">取消</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="消息内容" prop="des" key="des">
        </el-table-column>
        <el-table-column label="维护时间" prop="create_at" key=" create_at">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- <el-footer>
      <el-button type="primary" @click="postData">提交</el-button>
      <el-button @click="onCancle">取消</el-button>
    </el-footer> -->
  </el-container>
</template>

<script>
import { postAlter, getAlterData, deleteAlterData } from "@/api/program";
import { Message } from "element-ui";
export default {
  data() {
    return {
      tableData: [],
      result: {
        des: "",
      },
    };
  },
  created() {
    this.getAlterData();
  },
  methods: {
    handleDelete(index, value) {
      this.$confirm("此操作将永久删除该消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var id = value.id;
          deleteAlterData(id).then((res) => {
            console.log(res);
            this.getAlterData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
          //this.delete(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    delete(value) {},
    getAlterData() {
      getAlterData().then((res) => {
        console.log(res);
        this.tableData = res;
      });
    },
    onCancle() {},
    postData() {
      postAlter(this.result).then((res) => {
        this.getAlterData()
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