<template>
    <div class="text-h4 q-mb-md">Отпуска</div>
    <grid-view
        v-if="vacationsRaw && vacationsRaw.length"
        :gridCols="gridCols"
        @gv_sort="gridCols.sortField.bind(gridCols)"
    >
    </grid-view>

    <q-separator class="q-mt-md" />

    <div class="row q-mt-md">
        <div class="col flex justify-around">
            <q-input readonly v-model="vacationStartDate" label="Дата начала" dense>
                <template #append>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="vacationStartDate" mask="DD.MM.YYYY">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="OK" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
            <q-input readonly v-model="vacationEndDate" label="Дата конца" dense>
                <template #append>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="vacationEndDate" mask="DD.MM.YYYY">
                                <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="OK" color="primary" flat />
                                </div>
                            </q-date>
                        </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
            <div>
                <q-checkbox v-model="isMedicalVacation" left-label label="Больничный" />
            </div>
        </div>
    </div>
    <div class="row">
        <q-btn
            flat label="Назначить отпуск на эти даты" color="primary"
            class="q-ma-md"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { IVacation } from '@/interfaces/User';
import { GridCols } from '@/composables/gridView/GridColsManager';
import { vacationAvailableCols } from '@/components/grid/GridColumnOptions';
import GridView from '@/components/grid/GridView.vue';

const props = defineProps<{
    userId      : number
    vacationsRaw: IVacation[]
}>()

const vacationStartDate = ref<string>()
const vacationEndDate = ref<string>()
const isMedicalVacation = ref<boolean>(false)

const gridCols = new GridCols (
    ['dateFrom', 'dateTo', 'isMedical'],
    vacationAvailableCols,
    props.vacationsRaw,
    'id',
    'users',
    'user_field',
    5
);

</script>

<style lang="scss">

</style>
