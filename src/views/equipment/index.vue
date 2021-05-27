<template>
  <el-container>
    <el-header style="line-height: 60px"> 设备管理 </el-header>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      stripe
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        key="process_id"
        label="设备类型"
        prop="process_id"
        sortable
      >
      </el-table-column>

      <el-table-column
        key="process_name"
        label="设备名称"
        prop="process_name"
        sortable
      >
      </el-table-column>
      <el-table-column
        key="pro_name"
        :filters="proNameFilters"
        :filter-method="filterHandler"
        label="设备公司"
        prop="pro_name"
        sortable
      >
      </el-table-column>
      <el-table-column
        key="experimenter"
        label="存放地址"
        prop="experimenter"
        sortable
      >
      </el-table-column>
      <el-table-column
        key="incident_id"
        label="检修时间"
        prop="incident_id"
        sortable
      >
      </el-table-column>
      <el-table-column
        key="create_name"
        label="检修期"
        prop="create_name"
        sortable
      >
      </el-table-column>
      <el-table-column
        key="start_time_d"
        label="状态"
        prop="start_time_d"
        sortable
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDetail(scope.row)">
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="scope.row.process_status == '待分配'"
            @click="assginIncident(scope.row)"
          >
            分配
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <complex-table/> -->
  </el-container>
</template>

<script>
import myTable from "../table/simpleTable";
import ComplexTable from "../table/complex-table";

export default {
  name: "outStore",
  components: {
    ComplexTable,
  },
  data() {
    return {
      list: [],
    };
  },
};
</script>

<style>
</style>