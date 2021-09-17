<template>
  <el-container>
    <el-header style="line-height: 60px">上传模板文件</el-header>
    <el-main>
      <el-select
        v-model="tempname"
        placeholder="模板文件名称"
        clearable
        @change="fileChange"
        style="width: 200px"
        class="filter-item"
      >
        <el-option
          v-for="item in temOptions"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="processname"
        v-if="tempname == 5"
        placeholder="工序名称"
        clearable
        @change="processChange"
        style="width: 200px"
        class="filter-item"
      >
        <el-option
          v-for="process in processOptions"
          :key="process.key"
          :label="process.value"
          :value="process.key"
        />
      </el-select>
      <br />
      <el-upload
        style="margin-top: 20px; margin-right: 20px"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :limit="1"
        :file-list="fileList"
        class="upload"
        :auto-upload="false"
        :http-request="uploadFile"
      >
        <!--此处使用自定义上传实现http-request-->
        <el-button slot="trigger" type="primary">上传模板文件</el-button>
      </el-upload>
      <el-button @click="uploadFile" type="primary">确认</el-button>
    </el-main>
    <el-footer> </el-footer>
  </el-container>
</template>

<script>
import { getEpxList } from "@/api/experiment";

import { uploadFile, postTemFile } from "@/api/file";
export default {
  data() {
    return {
      fileList: [],
      fileDes: "",
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
      tempname: "",
      tempid: "",
      processname: "",
      processOptions: [
        // {
        //     key: 'CAI0',
        //     value: "CAI尺寸测量",
        //   },
        //   {
        //     key: 'CAI1',
        //     value: "CAI无损工序",
        //   },
        //   {
        //     key: 'CAI2',
        //     value: "CAI冲击工序",
        //   },
        //   {
        //     key: 'CAI3',
        //     value: "CAI应变剂黏贴工序",
        //   },
        //   {
        //     key: 'CAI4',
        //     value: "CAI压缩工序",
        //   },
      ],
      temOptions: [
        {
          key: 1,
          value: "委托书",
        },
        {
          key: 2,
          value: "任务书",
        },
        {
          key: 3,
          value: "试验大纲",
        },
        {
          key: 4,
          value: "检查单",
        },
        {
          key: 5,
          value: "试验单",
        },
        {
          key: 6,
          value: "试验件编码模板",
        },
      ],
    };
  },
  methods: {
    getEpxList() {
      getEpxList().then((response) => {
        response.data.forEach((element) => {
          var key = element.experi_type + element.experi_step;
          var type = element.experi_type
          var value = type+"_"+element.experiment_name;
          this.processOptions.push({
            key: key,
            value: value,
          });
        });
      });
    },
    getFileName(key) {
      this.temOptions.forEach((ele) => {
        if (ele.key == key) return (this.fileDes = ele.value);
      });
    },
    postTemFile(data) {
      postTemFile(data["f_key"], data).then((response) => {
      
      });
    },
    processChange() {
      
      this.tempid = this.tempname.toString() + this.processname.toString();
      this.processOptions.forEach((ele) => {
        if (ele.key == this.processname) {
          this.fileDes = ele.value;
        }
      });
      
      this.handleRemove();
    },
    fileChange() {
      
      this.getFileName(this.tempname);
      this.tempid = this.tempname;
      this.handleRemove();
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
    handleSuccess(response, file, index) {
      ;
      console.log(index);
    },
    onError(err) {
      message("error", "附件上传失败");
      console.log(err);
    },
    handleRemove() {
      console.log("移除附件...");
      this.$refs.upload.uploadFiles = [];

      // this.$refs.upload.clearFiles();//调用element官方的方法
    },
    strRebuild(str) {
      return strRebuild(str);
    },
    uploadFile(file) {
      // console.log(this.$refs.upload.uploadFiles[0].raw)
      // console.log(file)
      const param = new FormData();
      param.append("file", this.$refs.upload.uploadFiles[0].raw);
      // param.append("filename", file.file.name), param.append("f_id", "");
      //param.append("u_id", store.getters.name);
      //param.append("file_type", "updated");
      param.append("category", "template"); //template,
      uploadFile(param)
        .then((response) => {
          // TODO 一些关闭弹框，上传成功提示等
          //;
          this.$alert(
            `文件${this.fileDes}上传成功，文件ID是：${response.file_id}`,
            {
              confirmButtonText: "确定",
              callback: (action) => {
                this.postTemFile({
                  f_key: this.tempid,
                  f_des: this.fileDes,
                  f_id: response.file_id,
                });
              },
            }
          );

          ;
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
  },
  created() {
    this.getEpxList();
  },
};
</script>

<style>
</style>