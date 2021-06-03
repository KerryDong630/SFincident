<template>
  <el-container>
    <el-header style="line-height: 60px">新增出库</el-header>
    <el-main>
      <el-form class="demo-form-inline" style="margin-top: 20px">
        <el-row :gutter="40">
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="出库类型">
              <br />
              <el-select v-model="form.is_type" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="出库时间">
              <el-date-picker
                type="date"
                disabled
                format="yyyyMMdd"
                value-format="yyyyMMdd"
                placeholder="选择日期"
                v-model="form.out_date"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="试验件数量">
              <el-input v-model="form.is_num" type="number"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="出库接收人">
              <el-input v-model="form.out_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="委托单编号">
              <br />
              <el-select
                v-model="form.order_number"
                placeholder="委托单编号"
                clearable
                @change="selectOrder"
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
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="大纲编号">
              <br />
              <el-select
                v-model="form.program_code"
                placeholder="大纲编号"
                clearable
                @change="selectCode"
                class="filter-item"
              >
                <el-option
                  v-for="item in selections"
                  :key="item.program_code"
                  :label="item.program_code"
                  :value="item.program_code"
                />
              </el-select>
              <!-- <el-input v-model="form.program_code"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="备注">
              <el-input v-model="form.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData" border highlight-current-row>
        <el-table-column key="id" prop="id" label="编号"></el-table-column>
        <el-table-column
          key="component_unique_id"
          prop="component_unique_id"
          label="试验件编号"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.component_unique_id"
              placeholder=""
              @change="checkComponent(scope.row.component_unique_id)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-footer>
  </el-container>
</template>
<script>
const typeOptions = [
  {
    value: "已完成样品",
    key: 1,
  },
  {
    value: "问题样品",
    key: 2,
  },
];
import store from "../../store";
import { parseTime } from "@/utils";
import { addOutstore } from "@/api/inStore";
import { programsParameters } from "@/api/program";
import { getTemFileId, getTemFile } from "@/api/file";
import {
  getAssignProcess,
  putAssignProcess,
  putProcessStatus,
} from "@/api/process";
import { checkComponent } from "@/api/component";
export default {
  data() {
    return {
      typeOptions,
      tableData: [
        {
          id: 1,
          component_unique_id: "",
        },
        {
          id: 2,
          component_unique_id: "",
        },
        {
          id: 3,
          component_unique_id: "",
        },
        {
          id: 4,
          component_unique_id: "",
        },
      ],
      selections: null,
      onOption: null,
      form: {
        is_type: 1,
        create_name: store.getters.name,
        out_date: parseTime(new Date(), "{y}{m}{d}"),
        program_code: "",
        order_number: "",
        is_num: "",
        out_name: "",
        remarks: "",
      },
    };
  },
  created() {
    this.getSelection();
  },
  methods: {
    selectOrder() {
      var or = this.form["order_number"];

      this.selections.forEach((element) => {
        if (element.order_number == or) {
          this.form["program_code"] = element.program_code;
        }
      });

      console.log("change");
    },
    selectCode() {
      var or = this.form["program_code"];

      this.selections.forEach((element) => {
        if (element.program_code == or) {
          this.form["order_number"] = element.order_number;
        }
      });
    },
    checkComponent(id) {
      var data = {
        component_unique_id: id,
        is_type: this.form.is_type,
        order_number: this.form.order_number,
      };
      checkComponent(data).then((response) => {
        this.$message({
          message: response.message,
          type: "warning",
        });
      });
    },
    getSelection() {
      programsParameters().then((response) => {
        console.log(response);
        this.selections = response.data;
      });
    },
    onSubmit() {
      //试验件出库
      
      this.tableData.forEach((e) => {
        if (this.form.is_type == 1) {
          e["component_status1"] = 6;
        } else {
          e["component_status1"] = 5;
        }
        e["component_status"] = 2; //确认出库
        delete e["id"];
      });
      addOutstore(this.form).then((response) => {
        putAssignProcess({
          data: this.tableData,
        }).then((respones) => {
          console.log(respones);
          this.$notify({
            title: "Success",
            message: "提交成功",
            type: "success",
          });
           this.$router.push({
          path: "/outStore",
        });
        });
      });

      console.log("submit!");
    },
  },
};
</script>