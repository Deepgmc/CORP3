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
                <q-tab name="salary" icon="currency_ruble" label="Зарплата" />
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
                                :state="employeeStates[transitionTo.name as keyof typeof employeeStates]"
                                :transition="transitionTo"
                                size="md"
                                type="button"
                                @dispatch-action="dispatchAction"
                            ></state-icon>
                        </div>
                    </div>
                </q-tab-panel>

                <q-tab-panel name="vacation">
                    <employee-edit-vacation
                        :vacationsRaw="cardEmployee.vacations"
                        :userId="cardEmployee.userId"
                        :userName="cardEmployee.username"
                    ></employee-edit-vacation>
                </q-tab-panel>

                <q-tab-panel name="salary">
                    <employee-edit-salary
                        :cardEmployee="cardEmployee"
                        @set-salary="setSalary"
                    ></employee-edit-salary>
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
    import { notifyTypes, useNotify } from '@/composables/notifyQuasar';

    import StateIcon from '@/components/employee/StateIcon.vue';
    import EmployeeEditVacation from './EmployeeEditVacation.vue';
    import EmployeeEditSalary from './EmployeeEditSalary.vue';
    import { SAVED_SUCCESS } from '@/utils/constants/texts';

    const { cardEmployee } = useUserProfileCard()
    const notify = useNotify()

    const tab = ref('salary') //начально открытая вкладка
    const splitterModel = ref(15)

    function dispatchAction(action: string){
        cardEmployee.value.dispatch(action, false)
    }

    function setSalary(newSalaryAmount: number) {
        cardEmployee.value.setNewSalary(newSalaryAmount)
            .then((result) => {
                if(!result.error){
                    notify.run(SAVED_SUCCESS, notifyTypes.succ)
                } else {
                    notify.run(result.errorMessage, notifyTypes.err)
                }
            })
    }
</script>

<style lang="scss" scoped>
.splitter {
    min-height: 250px;
    width: 100%;
}

.q-tab--active {
    background-color: rgb(198, 255, 255);
}
</style>
