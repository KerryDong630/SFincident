<template>
  <el-container>
    <el-header style="line-height: 60px">工序负责人-工单分配 </el-header>
    <el-main>
      <el-form class="demo-form-inline">
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="12" class="parent">
            <el-form-item label="试验主管">
               {{ getUName(form.create_name) }}
           
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
    
            {{ getUName(form.process_owner) }}
            
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
      <el-table
        stripe
        border
        :data="form.componentlist"
        style="margin-top: 20px"
      >
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
        <el-table-column
          label="试验件状态"
          prop="component_status1"
          key="component_status1"
        >
          <template slot-scope="scope">
            {{ getStatus(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="实验员" prop="experimenter" key="experimenter">
          <template slot-scope="scope">
            {{ getUName(scope.row.experimenter) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="实验单" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
               v-if="scope.row.component_status1 == 4 || scope.row.component_status1 == 6 || scope.row.component_status1 == 3"
              @click="loadComponent(scope.$index, scope.row)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="scope.row.component_status1 == 4"
              @click="submitComponent(scope.row)"
            >
              确认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="onSubmit" v-if="processStatus == 3"
        >提交</el-button
      >
      <el-button @click="onCancle" v-if="processStatus == 3">取消</el-button>
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
  checkProcess,
  getProcessStatus,
} from "@/api/process";
import { addComponents } from "@/api/component";
const componentStatus = {
  0: "待分配",
  1: "已分配工单",
  2: "实验中",
  3: "实验结束",
  4: "待审核",
  5:"报废",
    6: "成品"
};
export default {
  data() {
    return {
      program_form_url: "",
      form_url: "",
      componentStatus,
      current_step: null,
      process_id: null,
      users: null,
      userName:{},
      fileName: "",
      form: {},
      processStatus: null,
    };
  },
  computed: {
    getPrcessor: function () {
      if (this.form.co_experimenter) {
        return this.form.co_experimenter.join(",");
      }
    },
  },
  created() {},
  mounted: function () {
    this.process_id = this.$route.query.process_id;
    this.getProcessStatus(this.process_id);
    this.getAssignList();
    this.getUsersList();
  },
  methods: {
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

    getProcessStatus: function (process_id) {
      getProcessStatus(process_id).then((response) => {
        this.processStatus = response.process_status;
      });
    },
    submitComponent: function (row) {
      //试验件状态变为已完成
      this.$confirm("确定此试验件已完成?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          row["component_status1"] = 3; //已完成
          //row['experiment_sheet_id'] = null;
          putAssignProcess({
            data: [row],
          }).then((respones) => {
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
    getStatus: function (row) {
      return componentStatus[row.component_status1];
    },
    loadComponent(index, row) {
      var sheet_id = row.experiment_sheet_id;
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
    open(callback) {
      this.$confirm("此操作将确认此工序完成?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          callback();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    checkStatus() {
      var flag = true;
      try {
        this.form.componentlist.forEach((element) => {
          if ( (element["component_status1"] !== 3) && (element["component_status1"] !== 5)) {
            flag = false;
            throw new Error("End Loop");
          }
        });
      } catch (error) {}
      return flag;
    },
    submitProcess() {
      var result = {
        process_id: this.process_id,
      };

      checkProcess(result).then((respones) => {
        this.$notify({
          title: "Success",
          message: "提交成功",
          type: "success",
        });
        this.$router.push({path:"/incidentOverview"})
      });
    },
    onSubmit() {
      var flag = this.checkStatus();
      //var flag = true;
      if (flag) {
        this.open(this.submitProcess);
      } else {
        this.$message.error("有试验件未完成，不可以提交当前工单");
      }
    },
    onCancle() {},
    getCurrentStep(process_id, processes) {
      processes.forEach((element, index) => {
        if (element.process_id == process_id) {
          this.current_step = index;
        }
      });
    },
      getUName(user){
      return this.userName[user];
    },  
    getUsersList() {
      getUsersList().then((response) => {
        this.users = response.data;
         response.data.forEach(ele=>{
          this.userName[ele.username] = ele.u_name
        });
      });
    },
    getAssignList() {
      var role_type = "process_owner"
      getAssignProcess(this.process_id,role_type).then((response) => {
        this.form = response.data;
        this.getCurrentStep(this.form.process_id, this.form.processes);
      });
    },
  },
};
</script>

<style>
</style>