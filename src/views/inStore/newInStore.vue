<template>
  <el-container>
    <el-header style="line-height: 60px">新增入库</el-header>
    <el-main>
      <label>新增入库信息</label>
      <el-form class="demo-form-inline" style="margin-top: 20px">
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="入库类型">
              <br />
              <el-select v-model="form.is_type" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
              <!-- <el-input v-model="form.is_type"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="入库时间">
              <el-date-picker
                type="date"
                disabled
                format="yyyyMMdd"
                value-format="yyyyMMdd"
                placeholder="选择日期"
                v-model="form.in_date"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="试验件数量">
              <el-input v-model="form.is_num" type="number"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="入库接收人">
              <el-input  disabled v-model="form.store_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="委托单编号">
              <br />
              <el-select
                v-model="form.order_number"
                placeholder="委托单编号"
                clearable
                @change="selectOrder"
                class="filter-item"
              >
                <el-option
                  v-for="item in selections"
                  :key="item.order_number"
                  :label="item.order_number"
                  :value="item.order_number"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <!-- <el-input v-model="form.program_code"></el-input> -->
            <el-form-item label="大纲编号">
              <br />
              <el-select
                v-model="form.program_code"
                placeholder="大纲编号"
                clearable
                class="filter-item"
              >
                <el-option
                  v-for="item in selections"
                  :key="item.program_code"
                  :label="item.program_code"
                  :value="item.program_code"
                />
              </el-select>
              <!-- <el-input v-model="form.program_code"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="入库位置">
              <el-input v-model="form.location"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="委托单编号">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="项目编号">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div class="tool-button">
        <el-button @click="downLoad">下载检查单模版</el-button>
        <el-upload
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :limit="1"
          :file-list="fileList"
          class="upload"
          :http-request="uploadFile"
        >
          <!--此处使用自定义上传实现http-request-->
          <el-button slot="trigger" type="primary">上传检查单</el-button>
        </el-upload>
        <!-- <el-button @click="upLoad">上传检查单</el-button> -->
      </div>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-footer>
  </el-container>
</template>
<script>
import store from "../../store";
import { parseTime } from "@/utils";
import { addInstore } from "@/api/inStore";
import { programsParameters } from "@/api/program";
import { getTemFileId, getTemFile } from "@/api/file";
import global_msg from "@/utils/global";
import { uploadFile } from "@/api/file";
const typeOptions = [
  {
    value: "待测样品",
    key: 0,
  },
  {
    value: "已完成样品",
    key: 1,
  },
  {
    value: "问题样品",
    key: 2,
  },
];
export default {
  data() {
    return {
      check_form_id: "",
      check_form_url: "",
      proCodeOption: null,
      typeOptions,
      fileName: ".doc",
      selections: null,
      onOption: null,
      form: {
        is_type: "",
        in_date: parseTime(new Date(), "{y}{m}{d}"),
        program_code: "",
        order_number: "",
        is_status: 0,
        is_num: "",
        in_store_num: 0,
        check_name: "",
        check_time: "",
        create_name: "",
        store_name: store.getters.name,
        location: "",
        check_form_id: "",
      },
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
    };
  },
  watch: {
    check_form_id() {
      this.check_form_url = global_msg.host + "/getFile/" + this.check_form_id;
      console.log(this.check_form_url);
    },
  },
  created() {
    this.getUrl();
    this.getSelection();
  },
  methods: {
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
    uploadFile(file) {
      const param = new FormData();
      param.append("file", file.file);
      param.append("category", "instore"); //instore,
      uploadFile(param)
        .then((response) => {
          // TODO 一些关闭弹框，上传成功提示等
          //console.log(response);
          this.form.check_form_id = response.file_id;

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
    getUrl() {
      //检查单
      getTemFileId(4).then((response) => {
        this.check_form_id = response.f_id;
        // getTemFile(f_id).then(response=>{
        //   console.log(response)
        // })
      });
    },
    selectOrder() {
      var or = this.form["order_number"];

      this.selections.forEach((element) => {
        if (element.order_number == or) {
          this.form["program_code"] = element.program_code;
        }
      });

      console.log("change");
    },
    saveFileName() {
      this.$prompt("请输入保存的文件名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          this.fileName = value + this.fileName;
          var url = this.check_form_url;

          this.getBlob(url).then((blob) => {
            this.saveAs(blob, this.fileName);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
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
    downLoad() {
      // this.saveFileName();
          this.fileName = "检查单模板";
          var url = this.check_form_url;

          this.getBlob(url).then((blob) => {
            this.saveAs(blob, this.fileName);
          });
    },

    upLoad() {},
    getSelection() {
      programsParameters().then((response) => {
        console.log(response);
        this.selections = response.data;
      });
    },
    onSubmit() {
      if (this.form.check_form_id == "") {
        this.$message.error("请上传检查单");
        return;
      }
      //this.form.create_name = store.getters.name;
      //this.form.store_name = "" ? store.getters.name : this.form.store_name;
      this.is_num = parseInt(this.is_num);
      console.log(this.form);
      addInstore(this.form).then(() => {
        // this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: "Created Successfully",
          type: "success",
        });
        this.$router.push("/inStore");
      });
    },
  },
};
</script>