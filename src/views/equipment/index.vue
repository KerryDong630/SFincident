<template>
  <el-container>
    <el-header style="line-height: 60px">设备管理</el-header>
    <el-main>
      <upload-excel-component
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="excel-upload"
      />
      <div class="tool-button">
        <!-- <el-button
          type="primary"
          @click="exportExecel"
          icon="el-icon-download"
        ></el-button> -->
        <el-button type="primary" @click="open">提交</el-button>
      </div>
      <el-table
        :data="list"
        border
        fit
        v-loading="loading"
        highlight-current-row
        stripe
        style="width: 100%"
       
      >
        <el-table-column key="id" label="设备编号" prop="id" sortable>
        </el-table-column>
        <el-table-column
          key="equipment_model"
          label="设备型号"
          prop="equipment_model"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="equipment_type"
          label="设备类型"
          prop="equipment_type"
          sortable
        >
        </el-table-column>

        <el-table-column
          key="equipment_name"
          label="设备名称"
          prop="equipment_name"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="equipment_company"
          label="设备公司"
          prop="equipment_company"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="location"
          label="存放地址"
          prop="location"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="measuring_time"
          label="计量时间"
          prop="measuring_time"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="measuring_period"
          label="计量期"
          prop="measuring_period"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="measuring_id"
          label="计量编号"
          prop="measuring_id"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="measure_part"
          label="计量结构"
          prop="measure_part"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="measuring_para"
          label="计量参数"
          prop="measuring_para"
          sortable
        >
        </el-table-column>
        <el-table-column
          key="measuring_res"
          label="设备负责人"
          prop="measuring_res"
          sortable
        >
        </el-table-column>
        <el-table-column key="status" label="状态" prop="status" sortable>
        </el-table-column>
        <el-table-column key="action" label="操作" prop="action" sortable>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { getEquipmentList, postEquipmentList } from "@/api/equipment";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
const lables = {
  编号: "equipment_id",
  设备型号: "equipment_model",
  设备类型: "equipment_type",
  设备名称: "equipment_name",
  "设备公司/制造商": "equipment_company",
  存放地址: "location",
  计量时间: "measuring_time",
  计量周期: "measuring_period",
  计量编号: "measuring_id",
  "计量规程/计量参数": "measuring_para",
  计量机构: "measure_part",
  设备负责人: "measuring_res",
  状态: "status",
  操作: "action",
};
export default {
  name: "equipment",
  components: { UploadExcelComponent },

  created() {
    this.getEquipmentList();
  },
  data() {
    return {
      lables,
      loading: false,
      list: [],
    };
  },
  methods: {
    handleSuccess({ results, header }) {
      //header.push("试验件编号");
      // results.forEach((element) => {
      //   element["试验件编号"] = this.generateUUID();
      // });

      this.list = results;
      // this.tableHeader = header;
    },
    open() {
      this.$confirm("是否确认提交设备表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.submit();
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消上传",
          });
        });
    },
    submit() {
      this.loading = true;
      postEquipmentList({
        data: this.list,
      }).then((res) => {
      
        this.loading = false;
        this.$notify({
          title: "Success",
          message: "上传成功",
          type: "success",
        });
      });
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    getEquipmentList() {
      this.loading = true;
      getEquipmentList().then((res) => {
        this.loading = false;
        this.list = res;
      });
    },
  },
};
</script>

<style>
</style>