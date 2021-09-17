<template>
   <el-container>
    <el-header style="line-height: 60px"> 消息提醒 </el-header>
    <el-main>
      <el-table :data="messageList">
        <el-table-column label="创建账号" key="create_name" prop="create_name">
        </el-table-column>
        <el-table-column label="创建时间" key="create_at" prop="create_at">
        </el-table-column>
        <el-table-column
          label="消息类型"
          key="message_notes"
          prop="message_notes"
        >
          <!-- <template slot-scope="scope">
            {{ messageType(scope.row.message_type) }}
          </template> -->
        </el-table-column>
        <el-table-column label="状态" key="message_satus" prop="message_satus">
          <template slot-scope="scope">
            {{ messageStatue(scope.row.message_satus) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editStatus(scope.$index,scope.row)"
              >标记已读</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { getMessageList, putMessage } from "@/api/message";
export default {
  data() {
    return {
      messageList: null,
    };
  },
  computed() {},
  created() {
    this.getMessageList();
  },
  methods: {
    editStatus(index,row) {
      
      this.$confirm("是否将消息标记已读?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          putMessage({
            message_id: row.message_id,
          }).then((response) => {
            this.$message({
              type: "success",
              message: "标记成功!",
            });
            this.getMessageList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    messageType(value) {
      switch (value) {
        case 0:
          return "入库申请";
        case 5:
          return "入库申请通过";
        case 6:
          return "入库申请驳回";
      }
    },
    messageStatue(value) {
      switch (value) {
        case 0:
          return "未读";
        case 1:
          return "已读";
      }
    },
    getMessageList() {
      getMessageList().then((response) => {
        ;
        this.messageList = response.data;
      });
    },
  },
};
</script>

<style>
</style>