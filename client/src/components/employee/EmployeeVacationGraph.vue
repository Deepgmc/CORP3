<template>
    <apexchart type="rangeBar" height="150" :options="options" :series="series"></apexchart>
</template>

<script lang="ts" setup>
import type { IVacation } from '@/interfaces/User';
import { getOneDayMilliseconds } from '@/utils/helpers/dates';
import { computed } from 'vue';

interface IProps {
   userId      : number,
   userName    : string,
   vacationsRaw: IVacation[]
};
const props = defineProps<IProps>()
const oneDay = getOneDayMilliseconds()

const sick = computed(() => {
    return getFiltered(props.vacationsRaw, (v: IVacation) => v.isMedical)
})
const vac = computed(() => {
    return getFiltered(props.vacationsRaw, (v: IVacation) => !v.isMedical)
})

function getFiltered(vacations: IVacation[], filterFn: (v: IVacation) => boolean) {
    return vacations
        .filter(filterFn)
        .map(s => {
            return {
                x: props.userName,
                y: [
                    +s.dateFrom + oneDay,
                    +s.dateTo + oneDay
                ]
            }
        })
}

const series = computed(() => {
    return [
        {
            name: 'Отпуска',
            data: vac.value
        },
        {
            name: 'Больничные',
            data: sick.value
        },
    ]
});

const options = {
    tooltip: {
        enabled: false,
    },
    chart: {
        height: 150,
        type: 'rangeBar',
        // events: {
        //     beforeZoom: () => {
        //         return false
        //     },
        // }
        zoom: {
            enabled: false
        }
    },
    plotOptions: {
        bar: {
            borderRadius: 1,
            horizontal: true,
        },

    },
    dataLabels: {
        enabled: true,
        formatter: function(val: any) {
            const from = (new Date(val[0]).getDate()) - 1
            const to = (new Date(val[1]).getDate()) - 1
            return `${from} - ${to}`
        },
        background: {
            enabled: false
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            formatter: function(val: number) {
                return new Date(val).toLocaleString('default', { month: 'short' });
            }
        }
    },
    fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: "horizontal",
                shadeIntensity: 0.5,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 20, 100],
                colorStops: []
            }
    },
    legend: {
        position: 'bottom'
    }
}

/**
 *
 {
                x: '1',
                y: [
                    new Date('2019-03-03').getTime(),
                    new Date('2019-03-05').getTime()
                ],
                // goals: [
                //     {
                //         name: 'Break',
                //         value: new Date('2019-03-14').getTime(),
                //         strokeColor: '#CD2F2A'
                //     }
                // ]
            },
 */
</script>
