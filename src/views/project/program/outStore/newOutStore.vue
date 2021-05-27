<template>
  <el-container>
    <el-header style="line-height: 60px">新建出库 </el-header>
    <el-main>
      <el-form class="demo-form-inline" style="margin-top: 20px; width: 80%">
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="委托单编号">
              <br />
              <el-select
                v-model="form.order_number"
                placeholder="委托单编号"
                clearable
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
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="检测项目">
              <el-input v-model="form.experi_project"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="试验件派工类型">
              <br />
              <el-select
                v-model="form.experi_type"
                placeholder="试验件派工类型"
                clearable
                @change="typeChange"
                class="filter-item"
              >
                <el-option
                  v-for="item in typeSeletion"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <!-- <el-input v-model="form.experi_type"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label="检测依据">
              <el-input v-model="form.experi_rely"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <label>工单派工工序</label>
      <el-table
        :data="listTable"
        border
        :cell-style="{ padding: '0', height: '10rem' }"
        highlight-current-row
        style="width: 100%; margin-top: 30px; margin-bottom: 30px"
      >
        <el-table-column
          width="60"
          key="step_number"
          label="步骤"
          prop="step_number"
        >
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row['experi_step']" />
          </template> -->
        </el-table-column>
        <el-table-column
          key="process_name"
          label="工序名称"
          prop="process_name"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.process_name" />
          </template>
        </el-table-column>
        <el-table-column
          key="start_time_d"
          label="计划开始时间"
          prop="start_time_d"
        >
          <template slot-scope="scope">
            <el-date-picker
              type="date"
              format="yyyyMMdd"
              value-format="yyyyMMdd"
              placeholder="选择日期"
              v-model="scope.row.start_time_d"
              style="width: 100%"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          key="end_time_d"
          label="计划结束时间"
          prop="end_time_d"
        >
          <template slot-scope="scope">
            <el-date-picker
              type="date"
              format="yyyyMMdd"
              value-format="yyyyMMdd"
              placeholder="选择日期"
              v-model="scope.row.end_time_d"
              style="width: 100%"
              @change="getRange(scope.row,scope.$index)"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          key="range_time"
          label="工时"
          prop="range_time"
        >
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.range_time" disabled />
          </template>
        </el-table-column>
        <el-table-column
          key="process_parameters"
          label="工序参数"
          prop="process_parameters"
        >
          <template slot-scope="scope">
            <el-input
              type="textarea"
              autosize
              v-model="scope.row.process_parameters"
            />
          </template>
        </el-table-column>
        <el-table-column
          key="process_notes"
          label="工序备注"
          prop="process_notes"
        >
          <template slot-scope="scope">
            <el-input
              type="textarea"
              autosize
              v-model="scope.row.process_notes"
            />
          </template>
        </el-table-column>
        <el-table-column
          key="process_owner"
          label="实验负责人"
          prop="process_owner"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.process_owner"
              placeholder="实验负责人"
              clearable
              class="filter-item"
            >
              <el-option
                v-for="item in users"
                :key="item.username"
                :label="item.u_name"
                :value="item.username"
              />
            </el-select>
            <!-- <el-input type="textarea" v-model="scope.row.experiment_owner" /> -->
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="margin-left: 0px" @click="downLoad(scope.row)">
              下载试验单
            </el-button>

            <el-upload
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :limit="1"
              :file-list="fileList"
              class="upload"
              style="margin-left: 0px"

              :http-request="uploadFile"
            >
              <!--此处使用自定义上传实现http-request-->
              <el-button
                slot="trigger"
                type="text"
                size="small"
                @click="getIndex(scope.$index)"
                >上传试验单</el-button
              >
            </el-upload>
            <el-button
              type="text"
              size="small"
              style="margin-left: 0px"
              @click="addRow(scope.$index, scope.row)"
            >
              添加工序
            </el-button>
            <el-button
              type="text"
              style="margin-left: 0px"
              size="small"
              @click="deleteRow(scope.$index, scope.row)"
            >
              删除工序
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tool-button" style="margin-top: 20px">
        <el-button type="primary" @click="add">新增试验件</el-button>
      </div>
      <label>试验件</label>

      <el-table :data="testList" style="margin-top: 20px">
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
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="removeComponent(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogPvVisible" title="可选零件">
        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          :data="componentList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
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
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addComponents">添加</el-button>
        </span>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import { getUsersList } from "@/api/user";
import { programsParameters } from "@/api/program";
import { addExComponent } from "@/api/component";
import { getTemplateEx } from "@/api/experiment";
import { addIncident } from "@/api/incident";
import { uploadFile } from "@/api/file";
import { getTemFileId, getTemFile } from "@/api/file";
import global_msg from "@/utils/global";

//import { getUsersList } from "@/api/user";

const lables = {
  process_name: "工序名称",
  step_number: "步骤",
  start_time_d: "计划开始时间",
  end_time_d: "计划结束时间",
  range_time: "工时",
  process_parameters: "工序参数",
  process_notes: "工序备注",
  experiment_owner: "实验负责人",
};
const experimentKey = {
  测量工序: 51,
  无损工序: 52,
  冲击工序: 53,
  应变剂黏贴工序: 54,
  压缩工序: 55,
};
const showColumns = [
  "process_name",
  "step_number",
  "start_time_d",
  "end_time_d",
  "range_time",
  "process_parameters",
  "process_notes",
  "experiment_owner",
];
export default {
  data() {
    return {
      fileList: [],
      lables,
      index: "",
      form_id: "",
      form_url: "",
      listTable: [],
      showColumns,
      experimentKey,
      template: null,
      fileName:"",
      typeSeletion: [],
      multipleSelection: [],
      componentList: null,
      dialogPvVisible: false,
      tableColumnList: [],
      testColumn: [],
      listLoading: false,
      testList: null,
      list: null,
      selections: null,
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
      formDes: {
        data: [
          {
            name: "委托单号",
            force: true,
            vlaue: "",
            key: "order_number",
          },
          {
            name: "检测项目",
            force: false,
            vlaue: "",
            key: "experi_project",
          },
          {
            name: "试验件派工类型",
            force: true,
            vlaue: "",
            key: "experi_type",
          },
          {
            name: "检测依据",
            force: true,
            vlaue: "",
            key: "experi_rely",
          },
        ],
      },
      form: {},
    };
  },
  created() {
    this.getSelection();
    this.getTemplateEx();
    this.getUsersList();
    //this.getList();
  },
  mounted: function () {
    if (this.$route.query.order_number) {
      this.form.order_number = this.$route.query.order_number;
    }
    //this.getList(this.order_number);
  },
  methods: {
   
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
    downLoad(row) {
      var process = row.process_name;
      var pKey = this.experimentKey[process];
      getTemFileId(pKey).then((response) => {
        this.form_id = response.f_id;
        console.log(this.form_id);
        this.form_url = global_msg.host + "/getFile/" + this.form_id;
        var url = this.form_url;
        this.fileName = this.form.order_number+"_"+process+"模板";
         this.getBlob(url).then((blob) => {
            this.saveAs(blob, this.fileName);
          });
      });
    },
    getIndex(index) {
      this.index = index;
    },
    uploadFile(file) {
      //更新检查单
      const param = new FormData();
      console.log(this.index);
      param.append("file", file.file);

      param.append("category", "process"); //process,
      uploadFile(param)
        .then((response) => {
          // TODO 一些关闭弹框，上传成功提示等
          //console.log(response);
          this.listTable[this.index].experiment_sheet_id = response.file_id;

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
    getUsersList() {
      getUsersList().then((response) => {
        console.log(response);
        this.users = response.data;
      });
    },
    addIndex(list, inumber) {
      list.forEach((ele, index) => {
        if (index > inumber) {
          ele["step_number"] = ele["step_number"] + 1;
        }
      });
      return list;
    },
    deleteIndex(list, inumber) {
      list.forEach((ele, index) => {
        if (index > inumber) {
          ele["step_number"] = ele["step_number"] - 1;
        }
      });
      return list;
    },
    addRow(index, row) {
      this.listTable = this.addIndex(this.listTable, index);
      this.listTable.splice(index + 1, 0, {
        step_number: index + 1,
      });

      console.log(index);
    },
    deleteRow(index, row) {
      this.listTable = this.deleteIndex(this.listTable, index);
      this.listTable.splice(index, 1);

      console.log(index);
    },
    getRange(row,index) {
      var range = row.end_time_d - row.start_time_d;
      if(this.listTable[index+1]){
      this.listTable[index+1].start_time_d = row.end_time_d;

      }
      console.log(range);
      row.range_time = range;
    },
    updateView(e) {
      this.$forceUpdate();
    },
    getTableColumnList(list) {
      this.tableColumnList = [];
      var obj = list[0];
      for (var v in obj) {
        if (this.showColumns.indexOf(v) > -1) {
          this.tableColumnList.push({
            prop: v,
            label: this.lables[v],
          });
        }
      }
      console.log(this.tableColumnList);
    },
    typeChange() {
      var data = this.template[this.form.experi_type];
      this.listTable = [];
      console.log(this.template);
      data.forEach((element) => {
        var obj = {};
        obj["step_number"] = element["experi_step"];
        obj["process_name"] = element["experiment_name"];
        obj["start_time_d"] = "";
        obj["end_time_d"] = "";
        obj["range_time"] = "";
        obj["process_parameters"] = "";
        obj["process_notes"] = "";
        obj["experiment_owner"] = "";
        this.listTable.push(obj);
      });

      console.log(this.listTable);
      //this.getTableColumnList(this.listTable);
    },
    getTemplateEx() {
      getTemplateEx().then((response) => {
        this.template = response;
        for (var k in response) {
          this.typeSeletion.push(k);
        }
      });
    },
    removeComponent(index, row) {
      this.testList.splice(index, 1);
    },
    addComponents() {
      this.dialogPvVisible = false;
      this.testList = this.multipleSelection;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    getComponent() {
      addExComponent(this.form.order_number).then((response) => {
        console.log(response);
        this.componentList = response.data;
      });
    },
    onSubmit() {
      this.listTable.forEach(element=>{
        if(!element.experiment_sheet_id){
        var process = element.process_name;
        var pKey = this.experimentKey[process];
        element.experiment_sheet_id = pKey;
        }
      })
      this.form["process_list"] = this.listTable;
      this.form["component_list"] = this.testList;
      console.log(this.form);
      addIncident(this.form).then((response) => {
        console.log(response);
        this.$notify({
          title: "Success",
          message: "成功创建工单",
          type: "success",
        });
        this.$router.push({
          path: "/incident",
        });
      });
    },
    add() {
      this.dialogPvVisible = true;
      this.getComponent();
    },
    getSelection() {
      programsParameters().then((response) => {
        console.log(response);
        this.selections = response.data;
      });
    },
  },
};
</script>

<style>
</style>