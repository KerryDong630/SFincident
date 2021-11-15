<template>
  <div class="app-container">
    <el-header class="app-header"> 项目管理 </el-header>
    <el-main>
      <div class="tool-button">
        <el-button type="primary" @click="toData">数据维护</el-button>
        <el-button type="primary" @click="add" icon="el-icon-plus"></el-button>
        <el-button
          type="primary"
          @click="refresh"
          icon="el-icon-refresh"
        ></el-button>
      </div>
      <el-table
        v-loading="listLoading"
        ref="filterTable"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column key="id" label="项目ID" prop="id" sortable>
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
        <el-table-column
          key="finish_time"
          label="项目预计结束时间"
          prop="finish_time"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="create_time"
          label="项目创建时间"
          prop="create_time"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="res_name"
          label="试验主管"
          prop="res_name"
          :filters="resFilters"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            {{ getUName(scope.row.res_name) }}
          </template>
        </el-table-column>
        <el-table-column
          key="pro_name"
          label="项目名称"
          prop="pro_name"
          :filters="proNameFilters"
          :filter-method="filterHandler"
        >
        </el-table-column>
        <!-- <el-table-column
          :key="col.prop"
          :label="col.label"
          :prop="col.prop"
          sortable
          :filters="filters(col.prop)"
          :filter-method="filterHandler"
          v-for="col in tableColumnList"
        >
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="{ row }">
            <!-- <el-button
              v-if="row.status !== 0"
              type="text"
              size="small"
              @click="showDetail(row)"
            >
              查看
            </el-button> -->
            <el-button type="text" size="small" @click="update(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogPvVisible" title="项目详情">
        <el-form class="demo-form-inline main-form">
          <el-row :gutter="40">
            <el-col
              v-for="(data, key) in pvData"
              :key="key"
              :xs="12"
              :sm="12"
              :lg="8"
            >
              <el-form-item :label="data.lable">
                <el-input
                  v-model="data.value"
                  v-if="data.key !== 'res_name'"
                  v-bind:disabled="disable(data.key)"
                ></el-input>
                <el-select
                  placeholder="实验主管"
                  clearable
                  style="width: 100%"
                  v-model="data.value"
                  v-if="data.key == 'res_name'"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.username"
                    :label="item.u_name"
                    :value="item.username"
                  >
                    <span style="float: left">{{ item.u_name }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                      >{{ item.username }}</span
                    >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button type="primary" @click="onUpdate" v-show="isUpdate"
          >立刻更新</el-button
        >
      </el-dialog>
    </el-main>
  </div>
</template>

<script>
import { getProjectsList, getProject, putProject } from "@/api/project";
import { getUsersList } from "@/api/user";
const statusTypeOptions = [
  { display_name: "未创建任务", key: "0" },
  { display_name: "已创建任务", key: "1" },
  { display_name: "任务中", key: "2" },
  { display_name: "完成", key: "3" },
];
const lables = {
  pro_name: "项目名称",
  company: "委托公司名称",
  finish_time: "项目预计结束时间",
  create_time: "项目创建时间",
  res_name: "试验主管",
  create_name: "项目负责人",
  category: "行业类型",
  tele_phone: "联系方式",
  postcode: "邮编",
  u_email: "邮箱",
  address: "详细地址",
  contact: "联系人",
  id: "项目ID",
};
const showColumns = [
  "id",
  "pro_name",
  "company",
  "finish_time",
  "create_time",
  "res_name",
  "create_name",
];
export default {
  name: "projectLst",
  data() {
    return {
      showColumns,
      lables,
      isUpdate: false,
      dialogPvVisible: false,
      tableColumnList: [],
      proNameFilters: [],
      resFilters: [],
      list: null,
      pvData: [],
      users: {},
      userList: [],
      statusTypeOptions,
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
    getUName(user) {
      return this.users[user];
    },
    getUsersList() {
      getUsersList().then((response) => {
        this.userList = response.data;
        response.data.forEach((ele) => {
          this.users[ele.username] = ele.u_name;
        });
        this.getList();
      });
    },
    getId(index) {
      return index + 1;
    },
    refresh() {
      this.getList();
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    filters(prop) {
      if (prop == "res_name") {
        return this.resFilters;
      } else if (prop == "pro_name") {
        return this.proNameFilters;
      } else {
        return;
      }
    },
    onUpdate() {
      var form = {};
      this.pvData.forEach((element) => {
        form[element.key] = element["value"];
      });
      putProject(form).then((response) => {
        this.$notify({
          title: "Success",
          message: "Update Successfully",
          type: "success",
        });
        this.dialogPvVisible = false;
        this.refresh();
      });
    },
    update(row) {
      this.isUpdate = true;
      var pro_name = row.pro_name;
      this.pvData = [];
      this.dialogPvVisible = true;
      getProject(pro_name).then((response) => {
        this.getPvData(response);
      });
    },
    disable(value) {
      //console.log(value);
      if (value !== "create_name" && value !== "create_time") {
        return false;
      } else {
        return true;
      }
    },
    getPvData(response) {
      for (var v in response) {
        this.pvData.push({
          value: response[v],
          lable: this.lables[v],
          key: v,
        });
      }
      console.log(this.pvData);
    },
    showDetail(row) {
      this.isUpdate = false;
      //查看任务具体内容
      var pro_name = row.pro_name;
      this.pvData = [];
      this.dialogPvVisible = true;
      getProject(pro_name).then((response) => {
        this.getPvData(response);
      });
    },
    getFilter(list) {
      list.forEach((row) => {
        var resultPro = this.proNameFilters.some((item) => {
          if (item.text == row.pro_name) {
            return true;
          }
        });
        var resultRes = this.resFilters.some((item) => {
          if (item.text == row.res_name) {
            return true;
          }
        });
        if (!resultPro) {
          this.proNameFilters.push({
            text: row.pro_name,
            value: row.pro_name,
          });
        }
        if (!resultRes) {
          this.resFilters.push({
            text: row.res_name,
            value: row.res_name,
          });
        }
      });
    },
    add() {
      this.$router.push({ path: "/newPoject" });
    },
    toData() {
      this.$router.push({ path: "/pieData" });
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
    getList() {
      this.listLoading = true;
      getProjectsList().then((response) => {
        this.listLoading = false;
        this.list = response.data;
        this.getTableColumnList(this.list);
        this.getFilter(this.list);
        this.total = response.data.total;
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