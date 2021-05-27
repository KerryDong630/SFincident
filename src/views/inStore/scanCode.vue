<template>
  <el-container>
    <el-header style="line-height: 60px"> 填写试验件编码</el-header>
    <el-main>
      <label>试验编码信息</label>
      <upload-excel-component
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      />
      <div class="tool-button">
        <el-button
          type="primary"
          @click="onDelete"
          icon="el-icon-delete"
        ></el-button>
      </div>
      <el-table
        :data="tableData"
        border
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="编号" label="编号" />
        <el-table-column prop="试验件原始编号" label="试验件原始编号" />
        <el-table-column prop="试验件编号" label="试验件编号">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.试验件编号"
              controls-position="right"
            />
          </template>
          ></el-table-column
        >
      </el-table>
    </el-main>
    <el-footer>
      <el-button @click="submit" type="success">提交</el-button>
      <el-button @click="oncancel" type="success">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { deepCopy } from "@/utils";
import {
  getAssignProcess,
  putAssignProcess,
  putProcessStatus,
} from "@/api/process";
import { putInstore } from "@/api/inStore";
import { scanCode } from "@/api/component";
export default {
  components: { UploadExcelComponent },

  data() {
    return {
      id: "",
      filename: "自动生成扭转码",
      autoWidth: true,
      bookType: "xlsx",
      tableData: [],
      tableHeader: [],
      list: null,
      multipleSelection: [],
    };
  },
  mounted: function () {
    //this.order_number = this.$route.query.order_number;

    this.id = this.$route.query.id;
  },
  methods: {
    onDelete() {
      this.$confirm("此操作将删除这些数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.forEach((element, index) => {
            this.multipleSelection.forEach((e) => {
              if (element.试验件编号 == e.试验件编号) {
                delete this.tableData[index];
              }
            });
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    changeInstore(num) {
      console.log(this.id);
      putInstore(this.id, { instore: num }).then((resoponse) => {
        console.log(resoponse);
      });
    },
    submit() {
      console.log(this.tableData);
      var data = deepCopy(this.tableData);
      data.forEach((e) => {
        e["original_id"] = e[this.tableHeader[1]];
        e["component_unique_id"] = e[this.tableHeader[2]];

        delete e[this.tableHeader[1]];
        delete e[this.tableHeader[2]];
        delete e[this.tableHeader[0]];
        e["component_status"] = 1;
        //e["component_status1"] = 0;
      });
      console.log(data);
      this.$confirm("确定确认上述试验件入库?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          scanCode({
            data: data,
            id: this.id,
          }).then((respones) => {
            console.log(respones);
            if (respones.message == "Success") {
              putAssignProcess({
                data: data,
                id:this.id
              }).then((respones) => {
                console.log(respones);
                this.changeInstore(data.length);
                this.$notify({
                  title: "Success",
                  message: "提交成功",
                  type: "success",
                });
              });
              //可以扫码入库
            } else {
              //不符合入库规则
              this.$message.error(
                `有${respones.data.length}条数据不满足入库要求,请检查后再提交`
              );
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      console.log(data);
    },
    oncancel() {},
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    handleSuccess({ results, header }) {
      //header.push("试验件编号");
      // results.forEach((element) => {
      //   element["试验件编号"] = this.generateUUID();
      // });
      this.tableData = results;

      this.tableHeader = header;
    },
    generateUUID() {
      var d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
      }
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
  },
};
</script>

<style>
</style>