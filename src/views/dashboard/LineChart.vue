<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { getComponentTime } from "@/api/dashboard";

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
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    // chartData: {
    //   type: Object,
    //   required: true,
    // },
  },
  data() {
    return {
      chart: null,
      xData:[],
      yData:[]
    };
  },
  watch: {
    // chartData: {
    //   deep: true,
    //   handler(val) {
    //     this.setOptions(val)
    //   }
    // }
  },
  mounted() {
    
    this.$nextTick(() => {
      this.getComponentTime();
      //this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  created(){
    //this.getComponentTime();
   // this.initChart();
  },
  methods: {
    getComponentTime() {
      getComponentTime().then((response) => {
        var data = response.data;
        const xData = [];
        const yData = [];
        for (let i in data) {
          var date = new Date(data[i]["date"]);
          xData.push(date.getMonth() + 1 + "/" + date.getDate());
          yData.push(data[i]["finish"]);
        }
        this.xData = xData;
        this.yData = yData;

        this.initChart();
      });
    },

    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.xData,this.yData);
    },
    setOptions(xData,yData) {
      
      this.chart.setOption({
        title:{
                  text: '试验件一周完成数量',
                  left: 'center'

        },
        xAxis: {
          data: xData,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        yAxis: {
           name: "个数",
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: ["expected", "actual"],
        },
        series: [
          {
            itemStyle: {
              normal: {
                color: "#FF005A",
                lineStyle: {
                  color: "#FF005A",
                  width: 2,
                },
              },
            },
            smooth: true,
            type: "line",
            data: yData,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          }
        ],
      });
    },
  },
};
</script>
