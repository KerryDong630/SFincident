<template>
  <el-container>
    <el-header style="line-height: 60px"> 试验件编码录入</el-header>
    <el-main>
      <!-- <label>试验编码信息</label> -->

      <div class="filter-container">
        <!-- <el-input
          v-model="listQuery.title"
          placeholder="Title"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        /> -->
        <el-select
          v-model="ifOrigCode"
          placeholder="*是否有原始码"
          
          @change="selectChange"
          style="width: 150px"
          class="filter-item"
        >
          <el-option
            v-for="item in importanceOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </div>
      <upload-excel-component
        v-if="ifOrigCode"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      />
      <el-table
        v-if="ifOrigCode"
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          v-for="item of tableHeader"
          :key="item"
          :prop="item"
          :label="item"
        />
      </el-table>
      <div class="tool-button">
        <el-button v-if="!ifOrigCode" @click="addNewLine">增加</el-button>
      </div>

      <el-table
        v-if="!ifOrigCode"
        :data="tableDataNoOrig"
        border
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column key="orderNum" prop="orderNum" label="课题/项目编码">
          <template slot-scope="scope">
            <el-input v-model="scope.row.orderNum" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column key="testType" prop="testType" label="测试项目类型">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.testType"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in tyarr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          key="materialCode"
          prop="materialCode"
          label="材料代码"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.materialCode"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in mcarr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column key="craftCode" prop="craftCode" label="工艺代码">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.craftCode"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in pcarr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column key="inTime" prop="inTime" label="试验件入库时间">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.inTime"
              placeholder=""
              disabled
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          key="component_unique_id"
          prop="component_unique_id"
          label="试验件编号"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.component_unique_id"
              placeholder=""
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updateRole(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button @click="downLoadTemp">模板下载</el-button>

      <el-button @click="generateCode" type="success">生成实验编号</el-button>
      <el-button @click="submit" type="success">提交</el-button>

      <!-- <el-button @click="exportExcel" type="success">导出实验编号</el-button> -->
    </el-footer>
  </el-container>
</template>

<script>
import { parseTime } from "@/utils";

import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { addComponents } from "@/api/component";
import { getTemFileId, getTemFile } from "@/api/file";
import { deepCopy } from "@/utils";
import global_msg from "@/utils/global";
import { getRulesList } from "@/api/rule";
import { getInstore } from "@/api/inStore";
const newObj = {
  orderNum: "",
  testType: "",
  materialCode: "",
  craftCode: "",
  inTime: parseTime(new Date(), "{y}{m}{d}"),
  component_unique_id: "",
};
export default {
  components: { UploadExcelComponent },

  data() {
    return {
      ifOrigCode: true,
      importanceOptions: [
        {
          value: "有原始编码",
          key: true,
        },
        {
          value: "无原始编码",
          key: false,
        },
      ],
      sourceUrl: "",
      form_id: "",
      filename: "",
      autoWidth: true,
      bookType: "xlsx",
      tableData: [],
      tableHeader: [],
      newObj,
      mcarr: [],
      tyarr: [],
      pcarr: [],
      tableDataNoOrig: [newObj],
      tableHeaderNoOrig: [
        {
          label: "课题/项目编码",
          key: "orderNum",
        },
        {
          label: "测试项目类型",
          key: "testType",
        },
        {
          label: "材料代码",
          key: "materialCode",
        },
        {
          label: "工艺代码",
          key: "craftCode",
        },
        {
          label: "试验件入库时间",
          key: "inTime",
        },
        {
          label: "试验件编号",
          key: "component_unique_id",
        },
      ],
      list: null,
    };
  },
  watch: {
    form_id() {
      this.sourceUrl = global_msg.host + "/getFile/" + this.form_id;
      console.log(this.sourceUrl);
    },
  },
  created() {
    this.getUrl();
    this.getRules();
  },
  mounted: function () {
    this.order_number = this.$route.query.order_number;
    this.instore_id = this.$route.query.id;
    this.is_num = getStoreInfo(this.instore_id);
    //this.getList(this.order_number);
  },
  methods: {
    getStoreInfo(id) {
      getInstore(id).then((response) => {
        return response.is_num;
      });
    },
    getRules() {
      getRulesList().then((respones) => {
        var ruleList = respones.data;
        console.log(ruleList);
        ruleList.forEach((element) => {
          if (element.type == "MC") {
            this.mcarr.push({
              label: element.name,
              value: element.code,
            });
          }
          if (element.type == "PC") {
            this.pcarr.push({
              label: element.name,
              value: element.code,
            });
          }
          if (element.type == "TY") {
            this.tyarr.push({
              label: element.name,
              value: element.code,
            });
          }
        });
        console.log(this.tyarr);
      });
    },
    getUrl() {
      //
      getTemFileId(6).then((response) => {
        this.form_id = response.f_id;
      });
    },
    addNewLine() {
      var obj = deepCopy(this.newObj)
      this.tableDataNoOrig.push(obj);
    },
    selectChange() {
      console.log(this.ifOrigCode);
    },
    downLoadTemp() {
      this.fileName = "试验件编码模板";
      var url = this.sourceUrl;
      console.log(url);
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
    submit() {
      if (this.ifOrigCode) {
        var data = deepCopy(this.tableData);
        data.forEach((e) => {
          e["original_id"] = e[this.tableHeader[1]];
          e["component_unique_id"] = e[this.tableHeader[2]];
          e["order_number"] = this.order_number;
          e["instore_id"] = this.instore_id;
          delete e[this.tableHeader[1]];
          delete e[this.tableHeader[2]];
          delete e[this.tableHeader[0]];
        });
      } else {
        var data = [];
        this.tableDataNoOrig.forEach((e, i) => {
          data.push({
            original_id: "",
            component_unique_id: e["component_unique_id"],
            order_number: this.order_number,
            instore_id: this.instore_id,
          });
          this.tableData.push({
            编号: i + 1,
            试验件原始编号: "",
            试验件编号: e["component_unique_id"],
          });
        });
        this.tableHeader = ["编号", "试验件原始编号", "试验件编号"];
      }
      // if (data.length !== this.is_num) {
      //   this.$message.error('提交数量和入库试验件数量不相符，请检查！')
      //   return
      // }
      console.log(data);
      var result = {
        data: data,
      };
      addComponents(result).then((respones) => {
        console.log(respones);
        this.$confirm("提交试验编码成功", {
          confirmButtonText: "导出实验编号",
          // cancelButtonText: '取消',
          type: "success",
          center: true,
        })
          .then(() => {
            this.exportExcel();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
        // this.$notify({
        //   title: "Success",
        //   message: "提交成功",
        //   type: "success",
        // });
      });
    },
    generateID(id) {
      var uuid = this.order_number + "-" + id;

      return uuid;
    },
    notempty(data) {
      var arr = [];
      data.map(function (val, index) {
        //过滤规则为，不为空串、不为null、不为undefined，也可自行修改
        if (val !== "" && val != undefined) {
          arr.push(val);
        }
      });
      return arr;
    },
    RandomCode() {
      for (var j = 0; j < 10; j++) {
        var randStr = "";
        for (var i = 0; i < 5; i++) {
          //此处的12为生成12位数字，可随即更改
          var randItem = Math.floor(Math.random() * 10);
          randStr += randItem;
        }
        return randStr;
      }
    },
    generateRuleId(table) {
      var uuid = "";
      var arr = [];
      console.log(table);
      for (var key in table) {
        if (key !== "component_unique_id") {
          if (key == "orderNum") {
            if (table[key] == "") {
              table[key] = "0000000";
            }
          }
          arr.push(table[key]);
        }
      }
      arr.push(this.RandomCode());
      arr = this.notempty(arr);
      uuid = arr.join("-");
      return uuid;
    },
    generateCode() {
      console.log(this.tableHeader);
      if (this.ifOrigCode) {
        this.tableHeader.push("试验件编号");

        this.tableData.forEach((e) => {
          e["试验件编号"] = this.generateID(e.试验件原始编号);
        });
      } else {
        this.tableDataNoOrig.forEach((e) => {
          e["component_unique_id"] = this.generateRuleId(e);
        });
      }

      console.log(this.tableDataNoOrig);
    },
    exportExcel() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = this.tableHeader;
        const filterVal = this.tableHeader;
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });
        this.$message({
          type: "success",
          message: "导出成功!",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
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
      this.tableData = results;
      this.tableHeader = header;
      var length = this.tableData.length;
      this.$message({
        showClose: true,
        message: "上传成功，试验件数量：" + length,
        type: "success",
      });
    },
  },
};
</script>

<style>
</style>