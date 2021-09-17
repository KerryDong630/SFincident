<template>
  <div class="app-container">
    <el-header class="app-header">用户管理</el-header>
    <el-main>
      <!-- <div class="filter-container">
        <el-input
          v-model="listQuery.projectId"
          placeholder="用户名"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.orderNumber"
          placeholder="工号"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.projectStatus"
          placeholder="部门"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in statusTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <el-select
          v-model="listQuery.projectStatus"
          placeholder="角色"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in statusTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
      </div> -->
      <div class="tool-button">
        <!-- <el-button type="primary" @click="upload">上传表格</el-button> -->

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
          :key="col.prop"
          :label="col.label"
          :prop="col.prop"
          v-bind:filters="filters(col.prop)"
          :filter-method="filterHandler"
          v-for="col in tableColumnList"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="{ row }">
            <!-- <el-button type="text" size="small" @click="updateRole(row)">
              编辑
            </el-button> -->
            <el-button type="text" size="small" @click="confirmDelete(row)">
              删除
            </el-button>
             <el-button type="text" size="small" @click="putPassword(row)">
              重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
const roles = [
  { name: "仓库", key: "warehouse" },
  { name: "任务", key: "program" },
  { name: "项目", key: "project" },
  { name: "试验员", key: "experimenter" },
  { name: "实验室", key: "laboratory" },
  { name: "设备管理", key: "equipment" },
  { name: "基础资料", key: "information" },
  { name: "用户管理", key: "admin" },
];
const auth = {
  warehouse:"仓库",
  program:'任务',
  project:'项目',
  experimenter:'试验员',
  laboratory:'实验室',
  equipment:'设备管理',
  information:'基础资料',
  admin:'用户管理'
}
//import myTable from "../table/simpleTable";
//import ComplexTable from "@/views/table/complex-table";
//import { getUsersList } from "@/api/user";
const statusTypeOptions = [
  { display_name: "未创建任务", key: "0" },
  { display_name: "已创建任务", key: "1" },
  { display_name: "任务中", key: "2" },
  { display_name: "完成", key: "3" },
];
const showLable = {
  id: "ID",
  u_authority: "账号权限",
  u_department: "部门",
  username: "账号",
  u_email: "邮箱",
  u_id: "用户名",
  u_name: "员工姓名",
  u_tele: "手机号",
};
import { changeUser } from "@/api/user";

import { getUsersList, deleteUser } from "@/api/user";
export default {
  name: "users",
  data() {
    return {
      showLable,
      filterId: [],
      filterUname: [],
      filterDepartment: [],
      filterRoles: [],
      dialogPvVisible: false,
      tableColumnList: [],
      list: null,
      pvData: {},
      statusTypeOptions,
      roles,
      auth,
      listLoading: true,
      listQuery: {
        projectId: undefined,
        orderNumber: undefined,
        projectStatus: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    exportExecel() {},
    handleFilter() {},
    unique(arr) {
      return Array.from(new Set(arr));
    },
    filters(name) {
      if (name == "username") {
        return this.filterUname;
      }else if(name == "u_id"){
        return this.filterId
      }
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    getFilters(list) {
      this.filterId = this.unique(
        list.map((element) => {
          return element.u_id;
        })
      ).map((e) => {
        return {
          text: e,
          value: e,
        };
      });
      this.filterUname = this.unique(
        list.map((element) => {
          return element.username;
        })
      ).map((e) => {
        return {
          text: e,
          value: e,
        };
      });
    },
    refresh() {
      this.getList();
    },
    putPassword(row){ 
      var username = row.username;
    changeUser(username, {
        password: '00000000',
        u_status : 0   
      }).then((response) => {
        this.$notify({
          title: "Success",
          message: "成功重置用户"+username+"的密码",
          type: "success",
        });
        //this.logout();
        
        //location.reload(true)
      });
    },
    confirmDelete(row) {
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.handeldeleteRole(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handeldeleteRole(row) {
      var username = row.username;
      deleteUser(username).then(() => {
        // this.dialogFormVisible = false;
        this.$notify({
          title: "Success",
          message: "Delete Successfully",
          type: "success",
        });
        this.getList();
      });
    },
    upload() {
      this.$router.push({ path: "/uploadUser" });
    },
    updateRole(row) {
      //查看任务具体内容

      this.$router.push({
        path: "/updateUser",
        query: {
          username: row.username,
        },
      });
    },
    
    add() {
      this.$router.push({ path: "/addUser" });
    },
    getTableColumnList(list) {
      var obj = list[0];
      for (var v in obj) {
    
        if(v in showLable ){

        this.tableColumnList.push({
          prop: v,
          label: this.showLable[v] || v,
        });
         }
      }
      console.log(this.tableColumnList);
    },
    showAuth(str){
        var arr = str.split(',');
        var narr = arr.map(ele=>{
          return this.auth[ele]
        });
        return narr.join(',')
    },
    getList() {
      this.listLoading = true;
      this.tableColumnList = [];
      getUsersList().then((response) => {
        this.listLoading = false;
        response.data.forEach(ele=>{
          ele.u_authority = this.showAuth(ele.u_authority)
        })
        this.list = response.data;

        this.getTableColumnList(this.list);
        this.getFilters(this.list);
      });
      // this.$axios.get("http://127.0.0.1:8000/up/users").then((response) => {
      //   //let data = response.data;

      // });
      // getUsersList().then((response) => {
      //   
      // this.list = response.data.items;
      // this.getTableColumnList(this.list);
      // this.total = response.data.total;
      // this.listLoading = false;
      // Just to simulate the time of the request
      // setTimeout(() => {
      //   this.listLoading = false;
      // }, 1.5 * 1000);
      //});
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