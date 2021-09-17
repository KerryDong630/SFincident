<template>
  <div class="app-container">
    <el-header class="app-header"> 试验任务管理 </el-header>
    <el-main>
      <div class="tool-button">
        <el-button type="primary" @click="add" icon="el-icon-plus"></el-button>
        <el-button
          type="primary"
          @click="refresh"
          icon="el-icon-refresh"
        ></el-button>
        <el-button
          type="primary"
          @click="exportExecel"
          icon="el-icon-download"
        ></el-button>
        <el-button type="primary" @click="toData">数据维护</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        ref="filterTable"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          key="project_name"
          label="项目名称"
          prop="project_name"
          :filters="proNameFilters"
          :filter-method="filterHandler"
        >
        </el-table-column>
        <el-table-column
          key="task_name_book"
          label="任务书名称"
          prop="task_name_book"
        >
        </el-table-column>
        <el-table-column
          key="order_number"
          label="委托单号"
          prop="order_number"
          :filters="orderNumFilters"
          :filter-method="filterHandler"
        >
        </el-table-column>
        <el-table-column
          key="program_code"
          label="试验大纲编码"
          prop="program_code"
        >
        </el-table-column>
        <el-table-column key="sample_num" label="样品数量" prop="sample_num">
        </el-table-column>
        <el-table-column key="w_sum" label="等待入库" prop="w_sum">
        </el-table-column>
        <el-table-column key="in_store_num" label="已入库" prop="in_store_num">
        </el-table-column>

        <el-table-column
          key="in_experiment"
          label="实验中"
          prop="in_experiment"
        >
        </el-table-column>
        <el-table-column key="is_finish" label="成品" prop="is_finish">
        </el-table-column>
        <el-table-column
          key="create_time"
          sortable
          label="项目创建时间"
          prop="create_time"
        >
        </el-table-column>
        <el-table-column
          key="finish_time"
          label="项目预计结束时间"
          prop="finish_time"
        >
        </el-table-column>
        <el-table-column key="res_name" label="试验主管" prop="res_name">
          <template slot-scope="scope">
            {{ getUName(scope.row.res_name) }}
          </template>
        </el-table-column>
        <el-table-column
          key="create_name"
          label="项目负责人"
          prop="create_name"
        >
          <template slot-scope="scope">
            {{ getUName(scope.row.create_name) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="{ row }">
            <el-button
              style="margin-left: 0px"
              v-if="row.order_number == null"
              type="text"
              size="small"
              @click="createProgram(row)"
            >
              新建试验任务
            </el-button>
            <el-button
              style="margin-left: 0px"
              v-if="row.in_store_num > 0"
              type="text"
              size="small"
              @click="createIncident(row)"
            >
              新建工单
            </el-button>
            <el-button
              v-if="row.w_sum > 0"
              type="text"
              size="small"
              style="margin-left: 0px"
              @click="handleInStore(row)"
            >
              确认入库
            </el-button>
            <el-button
              style="margin-left: 0px"
              v-if="row.status !== 0"
              type="text"
              size="small"
              @click="showDetail(row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogPvVisible" title="任务详情">
        <el-form class="demo-form-inline main-form">
          <el-row :gutter="40">
            <el-col
              v-for="(value, key) in pvData"
              :key="key"
              :xs="12"
              :sm="12"
              :lg="8"
            >
              <el-form-item :label="lables[key]">
                <el-input :value="value" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false"
            >Confirm</el-button
          >
        </span> -->
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
//import myTable from "../table/simpleTable";
//import ComplexTable from "@/views/table/complex-table";
import { getProgramsList } from "@/api/program";
import { getUsersList } from "@/api/user";

const statusTypeOptions = [
  { display_name: "未创建任务", key: "0" },
  { display_name: "已创建任务", key: "1" },
  { display_name: "任务中", key: "2" },
  { display_name: "完成", key: "3" },
];
const lables = {
  project_id: "项目ID",
  program_id: "试验大纲id",
  project_name: "项目名称",
  pro_name: "项目名称",
  company: "委托公司名称",
  task_id: "任务书编码",
  order_id: "委托书id",
  pro_id: "项目id",
  program_code: "试验大纲编码",
  task_name_book: "试验任务书名称",
  order_time: "委托单时间",
  finish_time: "项目预计结束时间",
  create_time: "项目创建时间",
  res_name: "试验主管",
  create_name: "项目负责人",
  remarks: "备注信息",
  test_item: "检测项目名称",
  order_number: "委托单号",
  contract_id: "试验任务课题组/合同号",
  sample_name: "样品名称",
  sample_material: "样品材料",
  sample_num: "样品数量",
  in_store_num: "已入库",
  in_experiment: "实验中",
  w_sum: "等待入库",
  is_finish: "成品",
  res_name: "试验主管",
  create_name: "项目负责人",
  category: "行业类型",
  tele_phone: "联系方式",
  postcode: "邮编",
  u_email: "邮箱",
  address: "详细地址",
  contact: "联系人",
  task_form_id: "任务书id",
};
const showColumns = [
  "id",
  "project_name",
  "task_id",
  "program_code",
  "sample_num",
  "in_store_num",
  "w_sum",
  "in_experiment",
  "is_finish",
  "create_time",
  "finish_time",
  "res_name",
  "order_number",
  "create_name",
];
export default {
  name: "management",
  data() {
    return {
      dialogPvVisible: false,
      tableColumnList: [],
      list: null,
      proNameFilters: [],
      orderNumFilters: [],
      pvData: {},
      showColumns,
      users: {},
      statusTypeOptions,
      lables,
      listLoading: true,
      listQuery: {
        projectId: undefined,
        orderNumber: undefined,
        projectStatus: undefined,
      },
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    toData() {
      this.$router.push({ path: "/alertata" });
    },
    getUName(user) {
      return this.users[user];
    },
    getUsersList() {
      getUsersList().then((response) => {
        response.data.forEach((ele) => {
          this.users[ele.username] = ele.u_name;
        });
        this.getList();
        console.log("users");
        console.log(this.users);
      });
    },
    refresh() {
      this.getList();
    },
    getHeader(data) {
      return Object.keys(data);
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
    exportExecel() {
      var tHeader = this.getHeader(this.list[0]);
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        //const tHeader = this.tableHeader;
        const filterVal = tHeader;
        //const list = this.tableData;
        const data = this.formatJson(filterVal, this.list);
 
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "试验任务数据",
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
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    getId(index) {
      return index + 1;
    },
    handleInStore(row) {
      var order_number = row.order_number;
      this.$router.push({
        path: "/comfirmStore",
        query: { order_number: order_number },
      });
    },
    createProgram(row) {
      this.$router.push({
        path: "/newpro",
        query: { pro_name: row.project_name },
      });
    },
    createIncident(row) {
      this.$router.push({
        path: "/newProincident",
        query: { order_number: row.order_number },
      });
    },
    showDetail(row) {
      //查看任务具体内容
      this.dialogPvVisible = true;
      this.pvData = row;
    },
    add() {
      this.$router.push({ path: "/newpro" });
    },
    getTableColumnList(list) {
      this.tableColumnList = [];
      var obj = list[0];
      for (var v in obj) {
        if (this.showColumns.includes(v)) {
          this.tableColumnList.push({
            prop: v,
            label: this.lables[v],
          });
        }
      }
    },
    getFilter(list) {
      list.forEach((row) => {
        this.proNameFilters.push({
          text: row.project_name,
          value: row.project_name,
        });
        this.orderNumFilters.push({
          text: row.order_number,
          value: row.order_number,
        });
      });
    },
    getList() {
      this.listLoading = true;
      getProgramsList().then((response) => {
        this.list = response.data;
        this.getTableColumnList(this.list);
        this.getFilter(this.list);
        this.listLoading = false;
      });
    },
  },
};
</script>

<style>
.tool-button {
  float: right;
  margin-bottom: 0.5rem;
}
</style>