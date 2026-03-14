<template>
    <div class="text-h4 q-mb-md">Отпуска</div>
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
                :data-userId="slotProps.itemId"
                @click="deleteVacation(slotProps.itemId)"
            />
        </template>
        <template #field_components="slotProps">
            <div v-if="slotProps.col === 'isMedical' && slotProps.row instanceof Vacation">
                {{ slotProps.row.getVacationIsMedicalText() }} ({{ slotProps.row.rangeDays }} дней)
            </div>
        </template>
    </grid-view>

    <q-separator class="q-mt-md" />

    <div class="row q-mt-md">
        <q-form @submit="addVacation" class="col flex justify-between items-center">
            <q-input readonly v-model="newVacation.dateFrom" label="Дата начала" dense>
                <template #append>
                    <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="newVacation.dateFrom" mask="DD.MM.YYYY">
                                <div class="row items-center justify-end">
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
                            <q-date v-model="newVacation.dateTo" mask="DD.MM.YYYY">
                                <div class="row items-center justify-end">
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
            <q-btn
                label="Назначить на эти даты"
                color="primary"
                type="submit"
            />
        </q-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { IVacation, TNewVacation } from '@/interfaces/User';
import { GridCols } from '@/composables/gridView/GridColsManager';
import { vacationAvailableCols } from '@/components/grid/GridColumnOptions';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar';
import GridView from '@/components/grid/GridView.vue';
import { Vacation } from '@/entities/Vacation';
import { convertStrToUnixTimestamp } from '@/utils/helpers/dates';
import { UNKNOWN_ERROR } from '@/utils/constants/texts';

interface IProps {
   userId      : number
   vacationsRaw: IVacation[]
};

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

async function addVacation(): Promise<void> {
    if(newVacation.dateFrom.length < 1 || newVacation.dateTo.length < 1){
        notify.run('Введите даты отпуска', notifyTypes.err)
        return
    }
    try {
        const dateFrom = convertStrToUnixTimestamp(newVacation.dateFrom)
        const dateTo = convertStrToUnixTimestamp(newVacation.dateTo)
        if(dateFrom.error || dateTo.error) {
            throw new TypeError('Неверные даты')
        }
        const newVac = new Vacation (
                Object.assign (
                newVacation,
                {
                    dateFrom: dateFrom.res,
                    dateTo: dateTo.res
                }
            )
        );
        if(await newVac.saveModel()){
            formReset()
        } else {
            throw new Error('Ошибка сохранения отпуска')
        }
    } catch (e: unknown) {
        let msg = UNKNOWN_ERROR
        if(e instanceof Error) msg = e.message
        else if(typeof e === 'string') msg = e
        notify.run(msg, notifyTypes.err)
    }
}

function deleteVacation(vacationId: number){
    console.log('deleting vacation:', vacationId)
}

function formReset(){
    newVacation.dateFrom = ''
    newVacation.dateTo = ''
    newVacation.isMedical = false
}

</script>
