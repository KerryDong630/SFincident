
<template>
  <el-container>
    <el-header style="line-height: 60px"> 出库管理 </el-header>

    <el-main>
      <div class="tool-button">
        <el-button @click="add" type="primary">新增</el-button>
        <el-button @click="refresh" type="primary">刷新</el-button>
        <el-button @click="exportExcel" type="primary">导出</el-button>
      </div>
      <el-table
        stripe
        v-loading="listLoading"
        ref="filterTable"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
      >
        <!-- <el-table-column key="id" label="编号" prop="id">
          <template slot-scope="scope">
            {{ getId(scope.$index) }}
          </template>
        </el-table-column> -->
        <el-table-column key="pro_name" label="编号" prop="id">
        </el-table-column>
        <el-table-column
          key="pro_name"
          label="项目名称"
          :filters="proNameFilters"
          :filter-method="filterHandler"
          prop="pro_name"
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
        <el-table-column key="is_num" label="试验件数量" prop="is_num">
        </el-table-column>
        <el-table-column key="is_num" label="出库数量" prop="is_num">
        </el-table-column>
        <!-- <el-table-column key="location" label="库位" prop="location">
        </el-table-column> -->
        <el-table-column key="is_type" label="出库类型" prop="is_type">
        </el-table-column>
        <el-table-column key="out_name" label="出库接收人" prop="out_name">
        </el-table-column>
        <!-- <el-table-column key="check_name" label="审核人" prop="check_name">
        </el-table-column> -->
        <!-- <el-table-column
          key="check_time"
          label="审核时间"
          prop="check_time"
          sortable
        >
        </el-table-column> -->
        <!-- <el-table-column
          key="is_status"
          label="审核状态"
          prop="is_status"
          :filters="statusfilters"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <i :class="getStatus(scope.row)" :style="{'color': getColor(scope.row.is_status)}" ></i>
          </template>
        </el-table-column> -->
        <el-table-column
          key="in_date"
          label="出库日期"
          prop="out_date"
          sortable
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="{ row }">
            <el-tooltip content="扫码入库" placement="top">
              <el-button
                size="mini"
                type="primary"
                v-if="row.is_type == '待测样品'"
                @click="scanCode(row)"
                icon="el-icon-help"
              ></el-button>
            </el-tooltip>
            <!-- <el-tooltip content="下载试验件编码" placement="top">
              <el-button
                size="mini"
                type="primary"
                v-if="row.is_status == 1 && row.in_store_num !== row.is_num"
                @click="downLoadCode(row)"
                icon="el-icon-download"
              ></el-button>
            </el-tooltip> -->
            <!-- <el-button type="text" size="small" @click="showDetail(row)">
              查看
            </el-button> -->
            <!-- <el-button
              type="text"
              size="small"
              v-if="row.in_store_num > 0"
              @click="editCode(row)"
            >
              填写试验件编码
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "outStore",
  components: {
    // ComplexTable
  },
};
</script>

<script>
import { getOutstoreList } from "@/api/inStore";
import { loadCodeComponent } from "@/api/component";
const lables = {
  pro_name: "项目名称",
  company: "委托公司名称",
  order_number: "委托单编号",
  task_id: "任务书编码",
  program_code: "试验大纲编码",
  task_name_book: "任务书名称",
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
  in_store_num: "已入库",
  is_process: "实验中",
  is_status: "状态",
  is_finish: "成品",
  id: "任务编号",
  is_type: "入库类型",
  is_num: "试验件数量",
  check_name: "审核人",
  check_time: "审核时间",
};
const statusfilters = [
  { text: "待审核", value: 0 },
  { text: "审核通过", value: 1 },
  { text: "审核失败", value: 2 },
];
const typeOptions = { 0: "待测样品", 1: "已完成样品", 2: "问题样品" };
const statusOptions = { 0: "待审核", 1: "审核通过", 2: "审核失败" };
const showColumns = [
  "id",
  "pro_name",
  "task_id",
  "program_code",
  "is_num",
  "in_date",
  "check_name",
  "in_store_num",
  "w_instore",
  "is_status",
  "is_process",
  "is_finish",
  "create_time",
  "store_name",
  "finish_time",
  "res_name",
  "order_number",
  "is_type",
  "check_time",
  "create_name",
];
export default {
  name: "outStore",
  data() {
    return {
      downloadLoading: false,
      proNameFilters: [],
      orderNumFilters: [],
      statusOptions,
      showColumns,
      typeOptions,
      lables,
      autoWidth: true,
      bookType: "xlsx",
      statusfilters,
      tableColumnList: [],
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getId(index) {
      return index + 1;
    },
    scanCode(row) {
      this.$router.push({
        path: "/newOutStore",
        query: {
          id: row.id,
        },
      });
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    getFilter(list) {
      list.forEach((row) => {
        var resultPro = this.proNameFilters.some((item) => {
          if (item.text == row.pro_name) {
            return true;
          }
        });
        var resultOrd = this.proNameFilters.some((item) => {
          if (item.text == row.order_number) {
            return true;
          }
        });
        if (!resultPro) {
          this.proNameFilters.push({
            text: row.pro_name,
            value: row.pro_name,
          });
        }
        if (!resultOrd) {
          this.orderNumFilters.push({
            text: row.order_number,
            value: row.order_number,
          });
        }
      });
    },
    getColor(status) {
      if (status == 1) {
        return "#67c23A";
      } else if (status == 0) {
        return "#E6A23C";
      } else {
        return "#F56C6C";
      }
    },
    editCode(row) {
      this.$router.push({
        path: "/inputCode",
        query: {
          order_number: row.order_number,
          id: row.id,
        },
      });
    },
    refresh() {
      this.getList();
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
    getHeader(data) {
      return Object.keys(data);
    },
    exportExcel() {
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
          filename: "出库管理",
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
    downLoadCode(row) {
      var id = row.id;
      loadCodeComponent(id).then((response) => {
        var data = response.data;
        var tableArr = ["编号", "试验件原始编号", "试验件编号"];

        var tableData = [];
        data.forEach((element, index) => {
          tableData.push({
            编号: index + 1,
            试验件原始编号: element.original_id,
            试验件编号: element.component_unique_id,
          });
        });
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = tableArr;
          const filterVal = tableArr;
          //const list = this.tableData;
          const data = this.formatJson(filterVal, tableData);

          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "试验件编码",
            autoWidth: this.autoWidth,
            bookType: this.bookType,
          });
          this.$message({
            type: "success",
            message: "导出成功!",
          });
          this.downloadLoading = false;
        });

        console.log(tableData);
      });
    },
    getStatus(value) {
      if (value.is_status == 1) {
        return "el-icon-success";
      } else if (value.is_status == 0) {
        return "el-icon-video-pause";
      } else {
        return "el-icon-error";
      }
      //return 'el-icon-delete'
      //return this.statusOptions[value.is_status];
    },
    handelData(list) {
      list.forEach((element) => {
        for (var k in element) {
          // if (k == "is_status") {
          //   element[k] = this.statusOptions[element[k]];
          // }
          if (k == "is_type") {
            element[k] = this.typeOptions[element[k]];
          }
        }
      });
    },

    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    getList() {
      this.listLoading = true;
      getOutstoreList().then((response) => {
        this.list = response.data;
        this.handelData(this.list);
        this.getFilter(this.list);

        //this.gettableColumnList(this.list);
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    add() {
      this.$router.push({ path: "/newOutStore" });
    },
    showDetail(row) {
      var id = row.sid;
    },
  },
};
</script>