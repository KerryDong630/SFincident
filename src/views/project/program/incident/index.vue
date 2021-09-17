<template>
  <div class="app-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon
              icon-class="incidentprocess"
              class-name="card-panel-icon"
            />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">处理中工单</div>
            <count-to
              :start-val="0"
              :end-val="overviewData.processIncident"
              :duration="1"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="unprocess" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">待处理工单</div>
            <count-to
              :start-val="0"
              :end-val="overviewData.unprocessIncident"
              :duration="1"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="skill" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">已完成工单</div>
            <count-to
              :start-val="0"
              :end-val="overviewData.finishIncident"
              :duration="1"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="create" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">创建的工单</div>
            <count-to
              :start-val="0"
              :end-val="overviewData.allIncident"
              :duration="1"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="tool-button">
      <el-button type="primary" @click="add" icon="el-icon-plus"></el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <!-- <el-table-column
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
        :filters="filters(col.prop)"
        :filter-method="filterHandler"
        sortable
        v-for="col in tableColumnList"
      >

      </el-table-column> -->
      <el-table-column key="incident_id" label="工单编号" prop="incident_id">
      </el-table-column>
      <el-table-column key="create_name" label="工单发起人" prop="create_name">
        <template slot-scope="scope">
          {{ getUName(scope.row.create_name) }}
        </template>
      </el-table-column>
      <el-table-column
        key="finish_time"
        label="预计完成时间"
        prop="finish_time"
      >
      </el-table-column>
      <el-table-column key="process_name" label="当前环节" prop="process_name">
      </el-table-column>
      <el-table-column key="create_at" label="创建时间" prop="create_at">
      </el-table-column>
      <el-table-column key="experimenter" label="试验员" prop="experimenter">
        <template slot-scope="scope">
          {{ getUName(scope.row.experimenter) }}
        </template>
      </el-table-column>
      <el-table-column key="start_time_d" label="开始时间" prop="start_time_d">
      </el-table-column>
      <el-table-column key="end_time_d" label="结束时间" prop="end_time_d">
      </el-table-column>
      <el-table-column
        key="process_status"
        label="状态"
        :filters="statusFilters"
        :filter-method="filterHandler"
        prop="process_status"
      >
        <template slot-scope="scope">
          <label :style="{ color: getColor(scope.row.process_status) }">{{
            getStatus(scope.row.process_status)
          }}</label>
        </template>
      </el-table-column>
      <el-table-column key="order_number" label="委托单号" prop="order_number">
      </el-table-column>
      <el-table-column key="pro_name" label="项目名称" prop="pro_name">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="download(row)">
            下载试验件
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import { incidentOverview, incidentList } from "@/api/incident";
import { getUsersList } from "@/api/user";
import { incidentComponents } from "@/api/component";

const lables = {
  pro_name: "项目名称",
  incident_id: "工单编号",
  create_name: "工单发起人",
  finish_time: "预计完成时间",
  process_name: "当前环节",
  experimenter: "试验员",
  process_status: "状态",
  order_number: "委托单号",
  create_at: "创建时间",
  start_time_d: "开始时间",
  end_time_d: "结束时间",
};
const statusFilters = [
  {
    text: "已创建",
    value: 0,
  },
  {
    text: "待分配",
    value: 1,
  },
  {
    text: "已分配",
    value: 2,
  },
  {
    text: "实验中",
    value: 3,
  },
  {
    text: "已完成",
    value: 4,
  },
];
const status = {
  0: "已创建",
  1: "待分配",
  2: "已分配",
  3: "实验中",
  4: "已完成",
};
export default {
  components: {
    CountTo,
  },
  created() {
    this.getUsersList();
    this.getOverview();
   
  },
  data() {
    return {
      lables,
      proNameFilters: [],
      statusFilters,
      status,
      overviewData: {},
      tableColumnList: [],
      list: null,
      downloadLoading: false,
      users: {},
      autoWidth: true,
      bookType: "xlsx",
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
  methods: {
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
    exportExcel(tHeader, list) {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        //const tHeader = this.tableHeader;
        const filterVal = tHeader;
        //const list = this.tableData;
        const data = this.formatJson(filterVal, list);
 
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
    },
    download(row) {
      var incident_id = row.incident_id;
      var table = [];
      var tableArr = ["编号", "试验件编号"];
      incidentComponents(incident_id).then((res) => {
        res.data.forEach((el, index) => {
          table.push({
            编号: index + 1,
            试验件编号: el.component_unique_id,
          });
        });
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = tableArr;
          const filterVal = tableArr;
          //const list = this.tableData;
          const data = this.formatJson(filterVal, table);

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
      });
    },
    getUName(user) {
      return this.users[user];
    },
    getUsersList() {
      getUsersList().then((response) => {
        response.data.forEach((ele) => {
          this.users[ele.username] = ele.u_name;
        });
        this.getIncidet();
      });
    },
    add() {
      this.$router.push({
        path: "/newProincident",
      });
    },
    filters(prop) {
      if (prop == "process_status") {
        return this.statusFilters;
      } else if (prop == "pro_name") {
        return this.proNameFilters;
      } else {
        return "";
      }
    },
    getFilter(list) {
      list.forEach((row) => {
        var resultPro = this.proNameFilters.some((item) => {
          if (item.text == row.pro_name) {
            return true;
          }
        });

        if (!resultPro) {
          this.proNameFilters.push({
            text: row.pro_name,
            value: row.pro_name,
          });
        }
      });
    },
    getId(index) {
      return index + 1;
    },
    sortChange() {},
    getOverview() {
      incidentOverview().then((response) => {
        this.overviewData = response;
      });
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    getColor(status) {
      if (status == 2) {
        return "#409EFF";
      } else if (status == 1) {
        return "#F56C6C";
      } else if (status == 0) {
        return "#909399";
      } else if (status == 3) {
        return "#E6A23C";
      } else if (status == 4) {
        return "#67C23A";
      }
    },
    getStatus(status) {
      return this.status[status];
      // this.list.forEach((element) => {
      //   for (var k in element) {
      //     if (k == "process_status") {
      //       element[k] = this.status[element[k]];
      //     }
      //   }
      // });

      // this.list.forEach((element) => {
      //   for (var k in element) {
      //     if (k == "process_status") {
      //       element[k] = this.status[element[k]];
      //     }
      //   }
      // });
    },
    getIncidet() {
      incidentList().then((response) => {
        this.list = response.data;
        //this.getStatus();
        this.getColumns(this.list);
        this.getFilter(this.list);
      });
    },
    getColumns(list) {
      this.tableColumnList = [];
      var obj = list[0];
      for (var v in obj) {
        if (this.lables[v]) {
          this.tableColumnList.push({
            prop: v,
            label: this.lables[v],
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
