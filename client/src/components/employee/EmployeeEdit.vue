<template>
    <slot name="header">
        Редактирование сорудника
    </slot>
    <q-splitter
        v-model="splitterModel"
        class="splitter q-pa-md flex justify-around"
    >
        <template #before>
            <q-tabs
                v-model="tab"
                vertical
                class="text-teal"
            >
                <q-tab name="status" icon="done" label="Статус сотрудника" />
                <q-tab name="vacation" icon="event" label="Отпуска" />
                <q-tab name="notes" icon="edit" label="Заметки" />
            </q-tabs>
        </template>

        <template #after>
            <q-tab-panels
                v-model="tab"
                animated
                swipeable
                vertical
                transition-prev="jump-up"
                transition-next="jump-up"
            >
                <q-tab-panel name="status">
                    <div class="text-h4 q-mb-md">Статус</div>
                    <div>
                        <div class="row">
                            <state-icon
                                :state="cardEmployee.state"
                                size="md"
                                type="icon"
                            ></state-icon>
                        </div>
                        <div class="row q-mt-md">
                            <state-icon
                                v-for="transitionTo in cardEmployee.state.transitions"
                                :key="transitionTo.name"
                                :state="employeeStates[transitionTo.name]"
                                :transition="transitionTo"
                                size="md"
                                type="button"
                                @dispatch-action="dispatchAction"
                            ></state-icon>
                        </div>
                    </div>
                </q-tab-panel>

                <q-tab-panel name="vacation">
                    <employee-vacation-graph
                        :vacationsRaw="cardEmployee.vacations"
                        :userId="cardEmployee.userId"
                        :userName="cardEmployee.username"
                    ></employee-vacation-graph>

                    <employee-edit-vacation
                        :vacationsRaw="cardEmployee.vacations"
                        :userId="cardEmployee.userId"
                    ></employee-edit-vacation>
                </q-tab-panel>

                <q-tab-panel name="notes">
                    <div class="text-h4 q-mb-md">Заметки</div>
                </q-tab-panel>
            </q-tab-panels>
        </template>
    </q-splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { employeeStates } from '@/entities/Employee';
import { useUserProfileCard } from '@/composables/userProfileCard';

import StateIcon from '@/components/employee/StateIcon.vue';
import EmployeeEditVacation from './EmployeeEditVacation.vue';
import EmployeeVacationGraph from './EmployeeVacationGraph.vue';

const { cardEmployee } = useUserProfileCard()
const tab = ref('vacation')
const splitterModel = ref(15)

function dispatchAction(action: string){
    cardEmployee.value.dispatch(action, false)
}

</script>

<style lang="scss">
.splitter {
    min-height: 250px;
    width: 100%;
}
</style>
