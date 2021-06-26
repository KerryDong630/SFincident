<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { getProcess } from "@/api/dashboard";
const animationDuration = 6000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      chart: null,
      xData: null,
      yData1: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getProcess();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    getProcess() {
      var dataType = {
        inMeasure: "测量",
        inStore: "已入库",
        inPaste: "应变计粘贴",
        inLossless: "无损",
        inConditions: "环境调节",
        inExp: "实验中",
      };
      getProcess('All').then((response) => {
        var data = response;
        $("#processID").addClass("chart-done");
        const yData1 = [],
          xData = [];
        for (let i in data) {
          yData1.push(data[i]);

          xData.push(dataType[i]);
        }
        this.yData1 = yData1;
        this.xData = xData;
        this.initChart();
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        title:{
          text:"工序完成状况",
          left:'center'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.xData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "试验件",
            data: this.yData1,
            type: "bar",

            barWidth: "60%",
            animationDuration,
          },
        ],
      });
    },
  },
};
</script>
