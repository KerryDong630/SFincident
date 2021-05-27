
<template>
  <el-container>
    <el-header style="line-height: 60px"> 实验派工管理 </el-header>

    <el-main>
      <div class="tool-button">
        <el-button
          type="primary"
          size="mini"
          @click="addTemplate"
          icon="el-icon-plus"
          >添加新派工模板</el-button
        >
      </div>
      <el-row
        v-for="(value, key) in template"
        :key="key"
        style="margin-top: 30px"
        class="rowBoard"
      >
        <label>{{ key }}</label>
        <div class="tool-button">
          <el-button
            type="primary"
            size="mini"
            @click="add"
            icon="el-icon-plus"
          ></el-button>
        </div>
        <el-steps :active="value.length" style="margin-top: 15px">
          <el-step
            v-for="pre in value"
            :key="pre.experiment_id"
            :title="pre.experiment_name"
          ></el-step>
        </el-steps>
      </el-row>
      <el-dialog
        title="提示"
        :visible.sync="dialogFormVisible"
        width="30%"
        :before-close="handleClose"
      >
        <div style="wdith: 400px">
          <el-form ref="form" :model="form">
            <el-form-item label="派工类型描述">
              <el-input v-model="form.experi_des"></el-input>
            </el-form-item>
            <el-form-item label="派工类型名称">
              <el-input v-model="form.experi_type"></el-input>
            </el-form-item>
          </el-form>
          <el-table :data="formData">
            <el-table-column prop="experi_step" label="派工步骤" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.experi_step" />
              </template>
            </el-table-column>
            <el-table-column
              prop="experiment_name"
              label="工序模板名称"
              width="180"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.experiment_name" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- <div class="tool-button">
        <el-button type="primary" @click="add" icon="el-icon-plus"></el-button>
      </div>
      <ComplexTable
        :list="listTable"
        :tableColumnList="tableColumnList"
      ></ComplexTable> -->
    </el-main>
  </el-container>
</template>

<script>
import { getTemplateEx } from "@/api/experiment";

import ComplexTable from "../table/complex-table";
import { getEpxList } from "@/api/experiment";
const lables = {
  experiment_name: "工序模板名称",
  experi_step: "派工步骤",
  experi_type: "派工类型名称",
  experi_des: "派工类型描述",
};
export default {
  name: "trailDispatch",
  components: {
    ComplexTable,
  },
  data() {
    return {
      lables,
      formData: [
        {
          experiment_name: "",
          experi_step: "",
        },
      ],
      form: {
        experi_des: "",
        experi_type: "",
      },
      template: null,
      tableColumnList: [],
      listTable: null,
      dialogFormVisible: false,
    };
  },
  created() {
    //this.getList();
    this.getTemplateEx();
  },
  methods: {
    addTemplate() {
      this.dialogFormVisible = true;
    },
    add() {},
    getList() {
      getEpxList().then((response) => {
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
    getTemplateEx() {
      getTemplateEx().then((response) => {
        this.template = response;
        console.log(this.template);
      });
    },
  },
};
</script>

<style>
.rowBoard {
  padding: 30px;
  border: 1px solid #6464f7;
}
</style>