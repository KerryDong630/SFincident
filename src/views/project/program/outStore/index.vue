<template>
  <div class="app-container"> 
    <div class="tool-button">
      <el-button type="primary" @click="add" icon="el-icon-plus"></el-button>
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
          :filters=orderNumFilters
          :filter-method="filterHandler"
        >
        </el-table-column>
        <el-table-column
          key="program_code"
          label="试验大纲编码"
          prop="program_code"
        >
        </el-table-column>
        <el-table-column key="sample_num" label="成品数量" prop="sample_num">
        </el-table-column>
        <el-table-column key="in_store_num" label="已出库成品" prop="in_store_num">
        </el-table-column>
        <el-table-column
          key="create_time"
          sortable
          label="项目创建时间"
          prop="create_time"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="{ row }">
            <el-button
              style="margin-left: 0px"
              v-if="row.order_number == null "
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
  </div>
</template>

<script>

import { incidentOverview, incidentList } from "@/api/incident";
const lables = {
  pro_name: "项目名称",
  incident_id: "工单编号",
  create_name: "工单发起人",
  finish_time: "预计完成时间",
  process_name: "当前环节",
  experimenter: "试验员",
  process_status: "状态",
  create_at: "创建时间",
  start_time_d: "开始时间",
  end_time_d: "结束时间",
};
const statusFilters = [
  {
    text: "已创建",
    value: "已创建",
  },
  {
    text: "待分配",
    value: "待分配",
  },
  {
    text: "已分配",
    value: "已分配",
  },
  {
    text: "实验中",
    value: "实验中",
  },
  {
    text: "已完成",
    value: "已完成",
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
  
  },
  created() {
   
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
    add() {
      this.$router.push({
        path: "/newProincident",
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
