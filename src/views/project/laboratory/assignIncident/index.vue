<template>
  <el-container>
    <el-header style="line-height: 60px">工序负责人-工单分配 </el-header>
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
      <el-checkbox v-model="checked" style="margin-top: 20px">是否全部分配</el-checkbox>
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
            <el-select
              v-model="scope.row.experimenter"
              placeholder="实验员"
              clearable
              :disabled="scope.row.component_status1 == 5"
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
          </template>
        </el-table-column>
        
        <el-table-column fixed="right" label="操作" width="150">
          
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="loadComponent(scope.$index, scope.row)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="checkOnSubmit">提交</el-button>
      <el-button @click="onCancle">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
const componentStatus = {
  0: "待分配",
  1: "已分配工单",
  2: "实验中",
  3: "实验结束",
  4: "待审核",
  5: "报废",
};
import { getUsersList } from "@/api/user";
import global_msg from "@/utils/global";

import {
  getAssignProcess,
  putAssignProcess,
  putProcessStatus,
} from "@/api/process";
import { addComponents } from "@/api/component";
export default {
  data() {
    return {
      program_form_url: "",
      form_url: "",
      fileName: "",
      checked:false,
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
    getStatus: function (row) {
      return componentStatus[row.component_status1];
    },
    loadComponent(index, row) {
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
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    open(callback) {
      this.$confirm("此操作将提交工序分配?", "提示", {
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
    mutipleCheck(){
      if(this.checked){
          //若批量分配
          var experimenter = this.form.componentlist[0]['experimenter']
          console.log(experimenter)
          this.form.componentlist.forEach(ele=>{
            if(ele.component_status1 !== 5){   //若试验件状态不为报废
              ele['experimenter'] = experimenter;

            }
          });

      }
    },
    checkOnSubmit() {
     this.mutipleCheck();
      for (var i = 0; i < this.form.componentlist.length; i++) {
        var element = this.form.componentlist[i];
        if ((!element["experimenter"] || element["experimenter"].trim() == "") && element.component_status1 !== 5) {
          this.$message.error("有未被分配试验员的试验件！请检查");
          return;
        }
      }
      this.open(this.onSubmit);
    },
    onSubmit() {
      this.form.componentlist.forEach((element) => {
        element["process_owner"] = this.form.process_owner;
        element["process_id"] = this.process_id;
        element["experiment_owner"] = this.form.create_name;
      });
      var result = {
        data: this.form.componentlist,
      };
      var processStatus = {
        process_id: this.process_id,
        process_status: 2, //工序状态变为已分配
        experimenter: this.form.componentlist[0].experimenter,
      };
      putAssignProcess(result).then((respones) => {

        this.$notify({
          title: "Success",
          message: "分配成功",
          type: "success",
        });
      });
      putProcessStatus(processStatus).then((response) => {
        this.$notify({
          title: "Success",
          message: "分配成功",
          type: "success",
        });
        this.$router.push({
          path: "/incidentOverview",
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
        this.users = response.data;
      });
    },
    getAssignList() {
      getAssignProcess(this.process_id).then((response) => {
        this.form = response.data;
        this.getCurrentStep(this.form.process_id, this.form.processes);
      });
    },
  },
};
</script>

<style>
</style>