<template>
    <slot name="header">
        Редактирование сорудника
    </slot>
    <q-splitter
        v-model="splitterModel"
        class="splitter q-pa-md flex justify-around"
    >
        <template #before>
            <q-tabs v-model="tab" vertical class="text-teal">
                <q-tab name="hire" icon="done" label="Статус сотрудника" />
                <q-tab name="vacation" icon="event" label="Отпуска" />
                <q-tab name="notes" icon="edit" label="Заметки" />
            </q-tabs>
        </template>

        <template #after>
            <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
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
                        <!-- <q-icon
                            v-if="
                                $um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.EDIT)(R_FIELDS.FIRE) &&
                                cardEmployee.state.name === employeeStateNames.HIRED
                            "
                            @click="cardEmployee.dispatch('fire', false)"
                            name="highlight_off" size="md" class="q-ml-sm pointer text-negative"
                        />
                        <q-icon
                            v-if="
                                $um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.VIEW)(R_FIELDS.ENTIRE) &&
                                cardEmployee.state.name === employeeStateNames.FIRED
                            "
                            @click="cardEmployee.dispatch('back', false)"
                            name="autorenew" size="md" class="q-ml-sm pointer text-info"
                        /> -->
                    </div>
                </q-tab-panel>

                <q-tab-panel name="vacation">
                    <div class="text-h4 q-mb-md">Отпуска</div>
                    <div class="row">
                        тут вывести уже назначенные отпуска со статусами активный/завершён, болезнь/отпуск (возможно, через gridView)
                    </div>
                    <div class="row">
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
                            <div>тут чекбокс болезнь или нет</div>
                        </div>
                    </div>
                    <div class="row">
                        <q-btn
                            flat label="Назначить отпуск на эти даты" color="primary"
                            class="q-ma-md"
                        />
                    </div>
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
import StateIcon from '@/components/employee/StateIcon.vue'
import { employeeStates } from '@/entities/Employee';
// import { R_ACTIONS, R_ENTITIES, R_FIELDS, Rbac } from '@/entities/Rbac';
import { useUserProfileCard } from '@/composables/userProfileCard';

//const $um = Rbac.getInstance()
const { cardEmployee } = useUserProfileCard()
const tab = ref('vacation')
const splitterModel = ref(15)
const vacationStartDate = ref<string>()
const vacationEndDate = ref<string>()

function dispatchAction(action: string){
    cardEmployee.value.dispatch(action, false)
}

</script>

<style lang="scss">
.splitter {
    height: 250px;
    width:100%;
}
</style>
