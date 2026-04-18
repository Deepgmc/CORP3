<template>
    <div class="text-h4 q-mb-md">Отпуска</div>

    <employee-vacation-graph
        :vacationsRaw="vacationsRaw"
        :userId="userId"
        :userName="userName"
    ></employee-vacation-graph>

    <grid-view
        v-if="vacationsRaw && vacationsRaw.length"
        :gridCols="gridCols"
        @gv_sort="gridCols.sortField.bind(gridCols)"
    >
        <template #actions_caption>
            <q-icon class="gv-edit_buttons-negative" name="edit" />
        </template>

        <template #actions_buttons="slotProps">
            <q-icon
                class="gv-edit_buttons-negative"
                name="delete"
                size="md"
                @click="deleteVacation(slotProps.itemId)"
            />
        </template>
        <template #field_components="slotProps">
            <div v-if="slotProps.col === 'isMedical' && slotProps.row instanceof Vacation">
                {{ slotProps.row.getVacationIsMedicalText() }} ({{ slotProps.row.rangeDays }} дней)
            </div>
        </template>
    </grid-view>

    <div class="form_container q-mt-md">
        <q-form @submit="addVacation" class="q-gutter-md">
            <div class="row justify-between">
                <q-input readonly v-model="newVacation.dateFrom" label="Дата начала" dense>
                    <template #append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date
                                    minimal
                                    flat
                                    v-model="newVacation.dateFrom"
                                    mask="DD.MM.YYYY"
                                >
                                    <div class="flex items-center justify-end">
                                        <q-btn v-close-popup label="OK" color="primary" flat />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input readonly v-model="newVacation.dateTo" label="Дата конца" dense>
                    <template #append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date
                                    minimal
                                    flat
                                    v-model="newVacation.dateTo"
                                    mask="DD.MM.YYYY"
                                >
                                    <div class="flex items-center justify-end">
                                        <q-btn v-close-popup label="OK" color="primary" flat />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <div>
                    <q-checkbox v-model="newVacation.isMedical" left-label label="Больничный" />
                </div>
            </div>
            <div class="row justify-end q-mt-md">
                <q-btn
                    label="Назначить на эти даты"
                    color="primary"
                    type="submit"
                />
            </div>
        </q-form>
    </div>
</template>

<script lang="ts" setup>
import { inject, reactive } from 'vue';
import { Rbac } from '@/entities/Rbac';
import { Vacation } from '@/entities/Vacation';
import type { IVacation, TNewVacation } from '@/interfaces/User';
import { GridCols } from '@/composables/gridView/GridColsManager';
import { vacationAvailableCols } from '@/composables/gridView/GridColumnOptions';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar';
import { convertStrToUnixTimestamp } from '@/utils/helpers/dates';
import { DELETE_ERROR, DELETE_SUCCESS } from '@/utils/constants/texts';

import EmployeeVacationGraph from './EmployeeVacationGraph.vue';

import GridView from '@/components/grid/GridView.vue';
import { rbacSym } from '@/utils/injecttionSymbols';

interface IProps {
   userId      : number,
   userName    : string,
   vacationsRaw: IVacation[]
};

const $userManager = inject<Rbac>(rbacSym) as Rbac
const notify = useNotify()
const props = defineProps<IProps>()

const newVacation: TNewVacation = reactive({
    dateFrom          : '01.03.2026',
    dateTo            : '10.03.2026',
    isMedical         : false,
    userId            : props.userId
})

const gridCols = new GridCols (
    ['id', 'dateFrom', 'dateTo', 'isMedical', 'vacationStatusText'],
    vacationAvailableCols,
    props.vacationsRaw,
    'id',
    'users',
    'user_field',
    5
);

function addVacation(): void {
    if(newVacation.dateFrom.length < 1 || newVacation.dateTo.length < 1){
        notify.run('Введите даты отпуска', notifyTypes.err)
        return
    }
    const dateFrom = convertStrToUnixTimestamp(newVacation.dateFrom)
    const dateTo = convertStrToUnixTimestamp(newVacation.dateTo)
    if(dateFrom.error || dateTo.error) {
        throw new TypeError('Неверные даты')
    }
    const newVac = new Vacation ({
        userId: newVacation.userId,
        isMedical: newVacation.isMedical,
        dateFrom: dateFrom.res,
        dateTo: dateTo.res
    });
    newVac.saveModel()
        .then((saveRes) => {
            if(!saveRes.error){
                formReset()
            } else {
                throw new Error(saveRes.errorMessage)
            }
        })
}

async function deleteVacation(vacationId: number){
    const vacationObj = $userManager.company.getVacationById(props.userId, vacationId)
    if(vacationObj){
        if(await vacationObj.delete()){
            notify.run(DELETE_SUCCESS, notifyTypes.succ)
        } else {
            notify.run(DELETE_ERROR, notifyTypes.err)
        }
    }
}

function formReset(){
    newVacation.dateFrom = ''
    newVacation.dateTo = ''
    newVacation.isMedical = false
}

</script>
