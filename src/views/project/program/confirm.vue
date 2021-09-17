<template>
  <el-container>
    <el-header style="line-height: 60px">新增入库单 </el-header>
    <el-main v-loading="loading">
      <el-form
        class="demo-form-inline main-form"
        style="margin-top: 80px"
        v-for="(form, index) in forms"
        :key="form"
      >
        <lable>入库确认单{{ form.id }}</lable>
        <el-row :gutter="40">
          <el-col
            v-for="(value, key) in form"
            :key="key"
            :xs="12"
            :sm="12"
            :lg="8"
          >
            <el-form-item
              :label="lables[key]"
              v-if="showLables.indexOf(key) > -1"
            >
              <el-input :value="value" v-if="key !== 'is_type'"></el-input>
              <el-input v-if="key == 'is_type'" :value="getType(value)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tool-button">
          <el-button @click="downLoad(index)">下载检查单</el-button>
          <el-upload
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :limit="1"
            :file-list="fileList"
            class="upload"
            :http-request="uploadFile"
          >
            <!--此处使用自定义上传实现http-request-->
            <el-button slot="trigger" type="primary">上传签字检查单</el-button>
          </el-upload>
          <!-- <el-button @click="upload">上传签字检查单</el-button> -->
          <el-button
            type="primary"
            @click="onSubmit(form.id, form.order_number, form.is_num)"
            >确认入库</el-button
          >
          <el-button
            type="danger"
            @click="onReject(form.id, form.order_number, form.is_num)"
            >驳回</el-button
          >
        </div>
      </el-form>
    </el-main>
    <el-footer> </el-footer>
  </el-container>
</template>

<script>
import { parseTime } from "@/utils";
import store from "../../../store";
import global_msg from "@/utils/global";
import { uploadFile } from "@/api/file";

import { getConfirmInstore, confirmInstore } from "@/api/inStore";
const typeOptions = {
  0: "待测样品",
  1: "已完成样品",
  2: "问题样品",
};

const lables = {
  pro_name: "项目名称",
  company: "委托公司名称",
  order_number: "委托单编号",
  task_id: "任务书编码",
  program_code: "试验大纲编码",
  task_name_book: "试验任务书名称",
  order_time: "委托单时间",
  finish_time: "项目预计结束时间",
  create_time: "项目创建时间",
  res_name: "试验主管",
  create_name: "项目负责人",
  remarks: "备注信息",
  test_item: "检测项目名称",
  in_date: "入库日期",
  contract_id: "试验任务课题组/合同号",
  sample_name: "样品名称",
  sample_material: "样品材料",
  sample_num: "样品数量",
  store_name: "入库接收人",
  is_instore: "已入库",
  is_process: "实验中",
  is_finish: "成品",
  id: "任务编号",
  is_type: "入库类型",
  is_num: "试验件数量",
};
const showLables = [
  "id",
  "pro_name",
  "task_id",
  "program_code",
  "is_num",
  "in_date",
  "is_instore",
  "w_instore",
  "is_process",
  "is_finish",
  "create_time",
  "store_name",
  "finish_time",
  "res_name",
  "is_type",
  "create_name",
];
export default {
  data() {
    return {
      check_form_id: "",
      downLoadUrl: "",
      fileName: "",
      forms: [],
      fileList: [],
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
      lables,
      loadind: false,
      showLables,
      typeOptions,
      form: {
        lable: "入库基础信息",
        data: [
          {
            name: "入库类型",
            force: true,
            value: "",
            key: "",
          },
          {
            name: "入库日期",
            force: true,
            value: "",
            key: "",
          },
          {
            name: "试验件数量",
            force: true,
            value: "",
            key: "",
          },
          {
            name: "入库接收人",
            force: true,
            value: "",
            key: "",
          },
          {
            name: "委托单编号",
            force: true,
            value: "",
            key: "",
          },
          {
            name: "大纲编号",
            force: true,
            value: "",
            key: "",
          },
          {
            name: "入库位置",
            force: true,
            value: "",
            key: "",
          },
        ],
      },
    };
  },
  mounted: function () {
    this.order_number = this.$route.query.order_number;
    this.getList(this.order_number);
  },
  methods: {
    getType(value) {
      return this.typeOptions[value];
    },
    uploadFile(file) {
      //更新检查单
      const param = new FormData();
      param.append("file", file.file);

      param.append("category", "instore"); //instore,
      uploadFile(param)
        .then((response) => {
          // TODO 一些关闭弹框，上传成功提示等
          //;
          this.sign_check_form_id = response.file_id;

          this.$notify({
            title: "Success",
            message: "上传成功",
            type: "success",
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
    saveFileName(value) {
      this.fileName = value + "_检查单";
      var url = this.downLoadUrl;

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

    /**
     * 下载
     * @param  {String} url 目标文件地址
     * @param  {String} filename 想要保存的文件名称
     */
    downLoad(index) {
      var row = this.forms[index];
      var file_id = row.check_form_id;
      if (file_id) {
        this.downLoadUrl = global_msg.host + "/getFile/" + file_id;
        this.saveFileName(row.order_number);
      }
    },
    onReject(id, order_number, is_num) {
      var data = {
        status: 2,
        id: id,
        order_number: order_number,
        is_num: 0,
        check_time: parseTime(new Date(), "{y}{m}{d}"),
        check_name: store.getters.name,
      };
      confirmInstore(data).then((response) => {
        // this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: "驳回入库成功",
          type: "success",
        });
        this.getList(this.order_number);
      });
    },
    onSubmit(id, order_number, is_num) {
      if (this.sign_check_form_id == "" || this.sign_check_form_id == null) {
        this.$message.error("请上传签字检查单");
        return;
      }
      var data = {
        status: 1,
        id: id,
        order_number: order_number,
        is_num: is_num,
        check_time: parseTime(new Date(), "{y}{m}{d}"),
        check_name: store.getters.name,
        sign_check_form_id: this.sign_check_form_id,
      };
      confirmInstore(data).then((response) => {
        // this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: "确认入库成功",
          type: "success",
        });
        this.getList(this.order_number);
      });
    },
    getList(id) {
      this.loadind = true;
      getConfirmInstore(id).then((response) => {
        // this.dialogFormVisible = false;

        this.forms = response.data;
        this.loadind = false;
      });
    },
  },
};
</script>

<style>
</style>