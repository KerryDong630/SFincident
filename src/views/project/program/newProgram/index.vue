<template>
  <el-container>
    <el-header style="line-height: 60px">新建试验任务 </el-header>
    <el-main>
      <label>{{ formDes.label }}</label>

      <el-form class="demo-form-inline main-form" style="margin-top: 20px">
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="8">
            <el-select
              v-model="form.pro_name"
              placeholder="项目名称"
              clearable
              class="filter-item"
            >
              <el-option
                v-for="item in select"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
            <!-- <el-input v-model="form.pro_name" placeholder="项目名称"></el-input> -->
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col
            v-for="item in formDes.data"
            :key="item.name"
            :xs="12"
            :sm="12"
            :lg="8"
          >
            <el-form-item :label="item.name" :required="item.force">
              <el-input
                
                v-model="item.value"
                v-if="item.key !== 'order_time'"
              ></el-input>
              <el-date-picker
                v-if="item.key == 'order_time'"
                type="date"
                placeholder="选择日期"
                value-format="yyyyMMdd"
                v-model="item.value"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="入库时间">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.date1"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="试验件数量">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="入库接收人">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="委托单编号">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="项目编号">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>

      <div class="tool-button">
        <el-button @click="downLoad">下载委托书模版</el-button>
        <el-upload
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :limit="1"
          :file-list="fileList"
          class="upload"
          :on-error="onError"
          :http-request="uploadFile"
        >
          <!--此处使用自定义上传实现http-request-->
          <el-button
            slot="trigger"
            @click="getFileId('order_id')"
            type="primary"
            ref="order_id"
            >上传委托书</el-button
          >
        </el-upload>
        <!-- <el-button @click="refresH">上传委托书</el-button> -->
        <el-upload
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :limit="1"
          :file-list="fileList"
          class="upload"
          :on-error="onError"
          :http-request="uploadFile"
        >
          <!--此处使用自定义上传实现http-request-->
          <el-button
            slot="trigger"
            @click="getFileId('task_form_id')"
            type="primary"
            ref="task_form_id"
            >上传任务书</el-button
          >
        </el-upload>
        <el-upload
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :limit="1"
          :file-list="fileList"
          class="upload"
          :http-request="uploadFile"
        >
          <!--此处使用自定义上传实现http-request-->
          <el-button
            slot="trigger"
            type="primary"
            @click="getFileId('program_id')"
            ref="program_id"
            >上传试验大纲</el-button
          >
        </el-upload>
      </div>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="cancle">取消</el-button>
    </el-footer>
  </el-container>
</template>
<script>
import { strRebuild, lastSubstring } from "@/utils/index";
import { uploadFile } from "@/api/file";
import { addProgram } from "@/api/program";
import { getSelectProject } from "@/api/project";
import store from "../../../../store";
export default {
  data() {
    return {
      formid: "",
      select: null,
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
      form: {},
      // 运行上传文件大小，单位 M
      fileSize: 10,
      formDes: {
        label: "任务信息",
        data: [
          {
            name: "任务书编码",
            force: true,
            value: "",
            key: "task_id",
          },
          {
            name: "试验大纲编码",
            force: true,
            value: "",
            key: "program_code",
          },
          {
            name: "试验任务书名称",
            force: true,
            value: "",
            key: "task_name_book",
          },
          {
            name: "委托单时间",
            force: true,
            value: "",
            key: "order_time",
          },
          {
            name: "备注信息",
            force: true,
            value: "",
            key: "remarks",
          },
          {
            name: "检测项目名称",
            force: true,
            value: "",
            key: "test_item",
          },

          {
            name: "委托单号",
            force: true,
            value: "",
            key: "order_number",
          },
          {
            name: "试验任务课题组/合同号",
            force: true,
            value: "",
            key: "contract_id",
          },
          {
            name: "样品名称",
            force: true,
            value: "",
            key: "sample_name",
          },

          {
            name: "样品材料",
            force: true,
            value: "",
            key: "sample_material",
          },
          {
            name: "样品数量",
            force: true,
            value: "",
            key: "sample_num",
          },
        ],
      },
    };
  },
  created() {
    getSelectProject().then((response) => {
      this.select = response.data;
      console.log(response);
    });
  },
   mounted: function () {
    if (this.$route.query.pro_name) {
      this.form.pro_name = this.$route.query.pro_name;
    }
    //this.getList(this.order_number);
  },
  methods: {
    downLoad(){},
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
    getFileId(value) {
      this.formid = value;
    },
    submitUpload() {
      var files = this.$refs.upload.uploadFiles;
      console.log(files);
      if (this.checkFile()) {
        console.log("上传附件...");
        this.$refs.upload.submit();
      } else {
        console.log("取消上传");
      }
    },
    handleSuccess(response, file, index) {
      console.log(response);
      console.log(index);
    },
    onError(err) {
      message("error", "附件上传失败");
      console.log(err);
    },
    handleRemove(file, fileList) {
      console.log("移除附件...");
    },
    strRebuild(str) {
      return strRebuild(str);
    },
    uploadFile(file) {
      const param = new FormData();
      param.append("file", file.file);
      // param.append("filename", file.file.name), param.append("f_id", "");
      //param.append("u_id", store.getters.name);
      //param.append("file_type", "updated");
      param.append("category", "incident"); //incident,
      uploadFile(param)
        .then((response) => {
          // TODO 一些关闭弹框，上传成功提示等
          //console.log(response);
          this.form[this.formid] = response.file_id;

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          // reject('error')
        });
    },
    cancle() {
      this.$confirm("此操作将取消新建任务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push({ path: "/managepro" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    onSubmit() {
      // if (
      //   !this.form.program_id ||
      //   !this.form.task_form_id ||
      //   !this.form.order_id
      // ) {
      //   this.$message.error("请上传相关文件再提交");
      //   return;
      // }
      this.formDes.data.forEach((element) => {
        this.form[element.key] = element.value;
      });
      this.select.forEach((element) => {
        if (element.value == this.form["pro_name"]) {
          this.form["pro_id"] = element.key;
        }
      });
      console.log(this.form);
      addProgram(this.form).then((response) => {
        console.log(response);
        this.$notify({
          title: "Success",
          message: "创建项目成功",
          type: "success",
        });
        this.$router.push({ path: "/managepro" });
      });
      console.log("submit!");
    },
  },
};
</script>