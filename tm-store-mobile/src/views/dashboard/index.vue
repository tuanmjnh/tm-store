<script setup lang="ts">
import leftMenu from "@/layouts/components/leftMenu.vue";
import Chart from '@/components/charts/index.vue'
import { $t } from '@/i18n'
const barOption = {
  title: {},
  tooltip: {},
  xAxis: {
    data: [$t('month.1'), $t('month.2'), $t('month.3'), $t('month.4'), $t('month.5'), $t('month.6')],
  },
  yAxis: {},
  series: [
    {
      name: 'sales',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
}

const lineOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
    },
  ],
}

const scoreOption = {
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%',
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      detail: {
        formatter: '{value}',
      },
      data: [
        {
          value: 50,
          name: 'SCORE',
        },
      ],
    },
  ],
}

const refBarOption = ref(barOption)
const refLineOption = ref(lineOption)
const refScoreOption = ref(scoreOption)
</script>

<template>
  <van-cell title="Charts" />
  <div class="p-16">
    <Chart :option="refBarOption" :style="{ height: '330px' }" />
    <Chart :option="refLineOption" :style="{ height: '330px' }" />
    <Chart :option="refScoreOption" :style="{ height: '330px' }" />
  </div>
</template>
