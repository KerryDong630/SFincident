<template>
  <el-container>
    <el-header style="line-height: 60px">领取工单任务 </el-header>
    <el-main>
      <el-form class="demo-form-inline">
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="试验主管">
              {{ form.create_name }}
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="预计完成时间">
              {{ form.finish_time }}
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="试验大纲编号">
              {{ form.task_id }}
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="委托书编号">
              {{ form.order_number }}
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="试验类型">
              {{ form.experi_type }}
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="当前工序负责人">
              {{ form.process_owner }}
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="参与人">
              {{ getPrcessor }}
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="试验大纲">
              <el-button type="primary" @click="downLoadProgram"
                >下载</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-steps :active="current_step" align-center style="margin-top: 20px">
        <el-step
          v-for="pre in form.processes"
          :key="pre.process_id"
          :title="pre.process_name"
          :description="'当前工序负责人:' + pre.process_owner"
        ></el-step>
      </el-steps>
      <el-table stripe :data="form.componentlist" 
      :cell-style="{ padding: '0', height: '10rem' }"
      style="margin-top: 20px">
        <el-table-column
          label="试验件编码"
          prop="component_unique_id"
          key="component_unique_id"
        >
        </el-table-column>
        <el-table-column
          label="试验件原始编号"
          prop="original_id"
          key="original_id"
        >
        </el-table-column>
        <el-table-column label="实验员" prop="experimenter" key="experimenter">
        </el-table-column>
        <el-table-column
          label="试验件状态"
          prop="component_status1"
          key="component_status1"
        >
          <template slot-scope="scope">
            {{ getStatus(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作1">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="small"
              v-if="scope.row.component_status1 == 2"
              @click="submitComponent(scope.row)"
            >
              提交
            </el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作2" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="downloadComponent(scope.$index, scope.row)"
            >
              下载实验单
            </el-button>
            <el-upload
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :limit="1"
              :file-list="fileList"
              class="upload"
              :http-request="uploadFile"
              style="margin-left:0px"
            >
              <!--此处使用自定义上传实现http-request-->
              <el-button
                slot="trigger"
                type="text"
                 size="small"
                @click="loadComponent(scope.$index, scope.row)"
                >上传实验单</el-button
              >
            </el-upload>
            <!-- <el-button
              type="text"
              size="small"
              @click="removeComponent(scope.$index, scope.row)"
            >
              上传实验单
            </el-button> -->
            <el-button
              type="danger"
              size="small"
              v-if="scope.row.component_status1 !== 5"
              @click="removeComponent(scope.$index, scope.row)"
            >
              报损
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <!-- <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onCancle">取消</el-button> -->
    </el-footer>
  </el-container>
</template>

<script>
import { getUsersList } from "@/api/user";
import global_msg from "@/utils/global";

import {
  getAssignProcess,
  putAssignProcess,
  putProcessStatus,
} from "@/api/process";
import { addComponents,reportFailure } from "@/api/component";
import { uploadFile } from "@/api/file";

const componentStatus = {
  0: "待分配",
  1: "已分配",
  2: "实验中",
  3: "实验结束",
  4: "待审核",
  5:"报废"
};
export default {
  data() {
    return {
      program_form_url: "",
      form_url: "",
      fileName: "",
      forms: [],
      fileList: [],
      currentRow: {},
      // 允许的文件类型
      fileType: [
        "xls",
        "xlsx",
        "pdf",
        "doc",
        "docx",
        "txt",
        "jpg",
        "png",
        "jpeg",
      ],
      componentStatus,
      current_step: null,
      process_id: null,
      users: null,
      form: {},
    };
  },
  computed: {
    getPrcessor: function () {
      console.log("join");
      if (this.form.co_experimenter) {
        return this.form.co_experimenter.join(",");
      }
    },
  },
  created() {},
  mounted: function () {
    this.process_id = this.$route.query.process_id;
    this.getAssignList();
    this.getUsersList();
  },
  methods: {
    uploadFile(file) {
      //更新检查单
      const param = new FormData();
      param.append("file", file.file);

      param.append("category", "component"); //component,
      uploadFile(param)
        .then((response) => {
          // TODO 一些关闭弹框，上传成功提示等
          //console.log(response);
          var file_id = response.file_id;

          this.$notify({
            title: "Success",
            message: "上传成功",
            type: "success",
          });
          this.currentRow["experiment_sheet_id"] = file_id;
          putAssignProcess({
            data: [this.currentRow],
          }).then((respones) => {
            console.log(respones);
            this.$notify({
              title: "Success",
              message: "提交成功",
              type: "success",
            });
            this.getAssignList();
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkFile() {
      var flag = true;
      var tip = "";
      console.log("check");
      var files = this.$refs.upload.uploadFiles;
      files.forEach((item) => {
        // 文件过大
        if (item.size > this.fileSize * 1024 * 1024) {
          flag = false;
          tip = " 文件超过" + this.fileSize + "M";
        }
        // 文件类型不属于可上传的类型
        if (!this.fileType.includes(lastSubstring(item.name, "."))) {
          flag = false;
          tip = " 文件类型不可上传";
        }
      });
      if (!flag) {
        message("error", tip);
      }
      return flag;
    },
    loadComponent(index, row) {
      this.currentRow = row;
    },
    downloadComponent(index, row) {
      var sheet_id = this.form.experiment_sheet_id;
      this.fileName =
        this.form.order_number +
        "_" +
        this.form.process_name +
        "_" +
        index.toString();
      this.form_url = global_msg.host + "/getFile/" + sheet_id;
      var url = this.form_url;
      this.getBlob(url).then((blob) => {
        this.saveAs(blob, this.fileName);
      });
    },
    downLoadProgram: function () {
      this.fileName = this.form.order_number + "_试验大纲";
      this.program_form_url =
        global_msg.host + "/getFile/" + this.form.program_id;
      var url = this.program_form_url;
      this.getBlob(url).then((blob) => {
        this.saveAs(blob, this.fileName);
      });
    },
    /**
     * 获取 blob
     * url 目标文件地址
     */
    getBlob(url) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          }
        };
        xhr.send();
      });
    },

    /**
     * 保存 blob
     * filename 想要保存的文件名称
     */
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement("a");
        const body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    },
    removeComponent:function(index,row){
     this.$confirm("确定此试验件报损?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
        console.log(row);
         reportFailure(row.component_unique_id).then(response=>{
           this.$message({
             type:"success",
              message: "试验件报损成功",
           })
            this.getAssignList();
         })
         
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    submitComponent: function (row) {
      //试验件状态变为待审核
      this.$confirm("确定提交此试验件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(row);
          row["component_status1"] = 4;
          putAssignProcess({
            data: [row],
          }).then((respones) => {
            console.log(respones);
            this.$notify({
              title: "Success",
              message: "提交成功",
              type: "success",
            });
            this.getAssignList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    putComponentStatus() {},
    getStatus: function (row) {
      return componentStatus[row.component_status1];
    },
    onSubmit() {
      var result = {
        data: this.form.componentlist,
      };
      var processStatus = {
        process_id: this.process_id,
        process_status: 2, //工序状态变为已分配
      };
      putAssignProcess(result).then((respones) => {
        console.log(respones);

        this.$notify({
          title: "Success",
          message: "分配成功",
          type: "success",
        });
      });
      putProcessStatus(processStatus).then((response) => {
        console.log(response);
        this.$notify({
          title: "Success",
          message: "分配成功",
          type: "success",
        });
      });
    },
    onCancle() {},
    getCurrentStep(process_id, processes) {
      processes.forEach((element, index) => {
        if (element.process_id == process_id) {
          this.current_step = index;
        }
      });
    },
    getUsersList() {
      getUsersList().then((response) => {
        console.log(response);
        this.users = response.data;
      });
    },
    getAssignList() {
      console.log(this.process_id);
      getAssignProcess(this.process_id).then((response) => {
        console.log(response);
        this.form = response.data;
        this.getCurrentStep(this.form.process_id, this.form.processes);
      });
    },
  },
};
</script>

<style>
</style>