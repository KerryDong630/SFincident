
<template>
  <el-container>
    <el-header style="line-height: 60px"> 委托商管理 </el-header>
    <ComplexTable
      :list="listTable"
      :tableColumnList="tableColumnList"
    ></ComplexTable>
  </el-container>
</template>

<script>
import { getCompanys } from "@/api/project";
import ComplexTable from "../table/complex-table";
const lables = {
  company: "委托公司名称",
  category: "行业类型",
  tele_phone: "联系方式",
  postcode: "邮编",
  u_email: "邮箱",
  address: "详细地址",
  contact: "联系人",
};
export default {
  name: "vendor",
  components: {
    ComplexTable,
  },
  data() {
    return {
      lables,
      tableColumnList:[],
      listTable: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getCompanys().then((response) => {
        console.log(response);
        this.listTable = response.data;
        var obj = this.listTable[0];
        for (var v in obj) {
          this.tableColumnList.push({
            prop: v,
            label: this.lables[v],
          });
        }
      });
    },
  },
};
</script>

<style>
</style>