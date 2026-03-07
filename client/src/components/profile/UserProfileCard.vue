<template>
    <q-dialog v-model="isUserProfileCardOpened">
        <q-card class="employee-card q-ma-md" flat bordered>
            <q-card-section class="bg-primary text-white q-pa-xs" :horizontal="true">
                <div class="text-h6">Профиль сотрудника</div>
            </q-card-section>

            <q-card-section class="q-gutter-y-md row">
                <div class="col-6 items-center q-gutter-md">
                    <!-- Фото профиля и основная информация -->
                    <div class="row items-center q-gutter-md">
                        <q-avatar size="140px" class="shadow-2">
                            <img :src="avatar" :alt="`${dialogEmployee.firstName} ${dialogEmployee.lastName}`">
                        </q-avatar>
                        <div class="column justify-center q-ml-xl">
                            <div class="text-h5 text-weight-bold">
                                {{ dialogEmployee.firstName }} {{ dialogEmployee.lastName }}
                            </div>
                            <div class="text-body3 text-grey-7">
                                <span class="text-weight-medium">дата рождения:</span>
                                <span class="text-weight-light q-ml-xs">{{ getReadableFormatFromTS(dialogEmployee.birth) }} ({{ getAgeFromTS(dialogEmployee.birth) }})</span>
                            </div>
                            <div class="text-body3 text-grey-7" v-if="dialogEmployee.reg_date">
                                <span class="text-weight-medium">дата регистрации:</span>
                                <span class="text-weight-light q-ml-xs">{{ getReadableFormatFromTS(dialogEmployee.reg_date) }}</span>
                            </div>
                            <div class="text-body3 text-grey-7">
                                <span class="text-weight-medium">пол:</span>
                                <span class="text-weight-light q-ml-xs">{{ genderOptions[dialogEmployee.gender]?.label.toLocaleLowerCase() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-6 column items-end justify-around">
                    <!-- Контактный телефон -->
                    <div class="row flex justify-center">
                        <q-icon size="md" name="phone" class="text-primary" />
                        <span class="text-body1 q-ml-sm">{{ dialogEmployee.phone }}</span>
                    </div>
                    <!-- email -->
                    <div class="row flex justify-center">
                        <q-icon size="md" name="email" class="text-primary" />
                        <span class="text-body1 q-ml-sm">{{ dialogEmployee.email }}</span>
                    </div>
                </div>
            </q-card-section>

            <q-separator color="lightgrey" />

            <q-card-section>
                <!-- Информация о компании -->
                <div class="row items-center">
                    <div class="col-4 q-pa-xs flex justify-center items-center">
                        <q-icon name="business" class="text-primary" />
                        <span class="text-body1 q-ml-md">{{ dialogEmployee.company?.name }}</span>
                        <span v-if="dialogEmployee.isManager()" class="subcaption q-ml-xs q-mt-xs">(руководитель)</span>
                    </div>
                    <div class="col-4 q-pa-xs flex justify-center items-center">
                        <q-icon name="work" class="text-primary q-ml-md" />
                        <span class="text-body1 q-ml-md">{{ dialogEmployee.department?.name }}</span>
                    </div>
                    <div class="col-4 q-pa-xs flex justify-center items-center">
                        <div class="text-subtitle1 text-grey-10">
                            <template v-if="!$um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.EDIT)(R_FIELDS.POSITION)">Должность: {{ positionText }}</template>
                            <template v-else>
                                <q-select
                                    class="profile-card_select"
                                    dense filled input-debounce="0"
                                    v-model="selectPositionModel"
                                    :options="selectPositionOptions"
                                    @update:model-value="onPositionSelect"
                                ></q-select>
                            </template>
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-separator color="lightgrey" />

            <q-card-section v-if="dialogEmployee.bio.trim()">
                <!-- Краткое описание -->
                <div class="row">
                    <div class="col-12 q-pa-md text-italic">
                        <div class="text-body1">
                            {{ dialogEmployee.bio }}
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-separator color="lightgrey" />

            <q-card-section>
                <!-- Навыки -->
                <div class="row" v-if="dialogEmployee.skills.length > 0">
                    <div class="col-12 wrap">
                        <q-icon name="school" class="text-primary" />
                        <span class="text-body2 q-ml-sm q-mb-sm">Навыки:</span>
                        <user-skills
                            :skills="dialogEmployee.skills"
                            :needAssession="false"
                            :removable="false"
                            :alwaysShowAll="true"
                            size="md"
                        ></user-skills>
                    </div>
                </div>
            </q-card-section>

            <!--Admin controls-->
            <q-card-section class="bg-warning text-white q-pa-xs" :horizontal="true" v-if="$um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.EDIT)(R_FIELDS.ENTIRE)">
                <div class="text-h6">Управление струдником</div>
            </q-card-section>
            <q-card-actions
                v-if="$um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.EDIT)(R_FIELDS.ENTIRE)"
                class="q-pa-md flex justify-around"
            >
                    <q-splitter v-model="splitterModel" style="height: 250px; width:100%;">
                        <template #before>
                            <q-tabs v-model="tab" vertical class="text-teal">
                                <q-tab name="hire" icon="done" label="Статус" />
                                <q-tab name="vacation" icon="event" label="Отпуска" />
                                <q-tab name="notes" icon="edit" label="Заметки" />
                            </q-tabs>
                        </template>

                        <template #after>
                            <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
                                <q-tab-panel name="hire">
                                    <div class="text-h4 q-mb-md">Статус</div>
                                    <div>
                                        (HireD: {{ dialogEmployee.hire_date }}) (FireD: {{ dialogEmployee.fire_date }})
                                        <br>State: {{ dialogEmployee.state }}
                                        <q-icon
                                            v-if="
                                                $um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.EDIT)(R_FIELDS.HIRE) &&
                                                dialogEmployee.state.name === employeeStateNames.INIT
                                            "
                                            @click="dialogEmployee.dispatch('hire')"
                                            name="thumb_up" size="md" class="q-ml-sm pointer text-secondary"
                                        />

                                        <q-icon
                                            v-if="
                                                $um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.EDIT)(R_FIELDS.FIRE) &&
                                                dialogEmployee.state.name === employeeStateNames.HIRED
                                            "
                                            @click="dialogEmployee.dispatch('fire')"
                                            name="highlight_off" size="md" class="q-ml-sm pointer text-negative"
                                        />

                                        <q-icon
                                            v-if="
                                                $um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.VIEW)(R_FIELDS.ENTIRE) &&
                                                dialogEmployee.state.name === employeeStateNames.FIRED
                                            "
                                            @click="dialogEmployee.dispatch('back')"
                                            name="autorenew" size="md" class="q-ml-sm pointer text-info"
                                        />
                                    </div>
                                </q-tab-panel>

                                <q-tab-panel name="vacation">
                                    <div class="text-h4 q-mb-md">Отпуска</div>
                                    <p>
                                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
                                        magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima
                                        assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                                </q-tab-panel>

                                <q-tab-panel name="notes">
                                    <div class="text-h4 q-mb-md">Заметки</div>
                                    <p>
                                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque
                                        magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima
                                        assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                                </q-tab-panel>
                            </q-tab-panels>
                        </template>
                    </q-splitter>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>


<script lang="ts" setup>
import { computed, ref } from 'vue';
import { R_ACTIONS, R_ENTITIES, R_FIELDS, Rbac } from '@/entities/Rbac';
import { useUserProfileCard } from '@/composables/userProfileCard';
import UserSkills from '@/components/UserSkills.vue'
import { genderOptions } from '@/utils/constants/main';
import { getAgeFromTS, getReadableFormatFromTS } from '@/utils/helpers/dates';
import { getSelectOptionsFromDataArray } from '@/utils/helpers/components';
import type { IPosition } from '@/interfaces/Company';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
import { SAVED_SUCCESS } from '@/utils/constants/texts';
import type { TResult } from '@/interfaces/Error';
import { employeeStateNames } from '@/entities/Employee';
const notify = useNotify()
const $um = Rbac.getInstance()

const { isUserProfileCardOpened, dialogEmployee, avatar } = useUserProfileCard()

const selectPositionModel = ref({
    label: dialogEmployee.value?.position?.position,
    value: dialogEmployee.value?.position?.id
})

const tab = ref('hire')
const splitterModel = ref(10)

const selectPositionOptions = computed(() => {
    return getSelectOptionsFromDataArray<IPosition>($um.company.positions, {
        idField: 'id',
        labelField: 'position'
    })
})
const positionText = computed(() => {
    if(dialogEmployee.value === undefined || dialogEmployee.value.position?.position === undefined){
        return 'не указана'
    }
    return dialogEmployee.value.position.position
})
async function onPositionSelect(): Promise<void> {
    if(!selectPositionModel.value.value) return
    const res: TResult = await $um.company.changeEmployeePosition(selectPositionModel.value.value, dialogEmployee.value.userId)
    if(res.error) {
        notify.run(res.errorMessage, notifyTypes.err)
        return
    }
    notify.run(SAVED_SUCCESS, notifyTypes.succ)
}
</script>



<style lang="scss" scoped>
.employee-card {
    max-width: 1200px;
    min-height: 400px;
    .profile-card_select {
        width:250px;
    }
}

.employee-card .q-card__section {
    padding: 12px;
}

@media (max-width: 768px) {
    .employee-card {
        max-width: 100%;
    }
    .row.items-center {
        flex-direction: column;
        text-align: center;
    }
    .col-auto {
        width: 100%;
        text-align: center;
        margin-bottom: 8px;
    }
}
@media (min-width: 800px) {
    .employee-card {
        min-width: 800px;
    }
}
</style>
