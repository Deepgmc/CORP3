<template>
    <q-dialog v-model="isUserProfileCardOpened">
        <q-card class="employee-card q-ma-md" flat bordered>
            <q-card-section class="bg-primary text-white q-pa-xs" :horizontal="true">
                <div class="text-h6">Профиль сотрудника</div>
            </q-card-section>

            <q-card-section class="q-gutter-y-md row">
                <div class="col-7 items-center q-gutter-md">
                    <!-- Фото профиля и основная информация -->
                    <div class="row items-center">
                        <div class="col-4">
                            <q-avatar size="140px" class="shadow-2">
                                <img :src="avatar" :alt="`${cardEmployee.firstName} ${cardEmployee.lastName}`">
                            </q-avatar>
                        </div>
                        <div class="col-8">
                            <div class="column justify-center q-ml-xl">
                                <div class="text-h5 text-weight-bold">
                                    {{ cardEmployee.firstName }} {{ cardEmployee.lastName }}
                                </div>
                                <div class="text-body3 text-grey-7">
                                    <span class="text-weight-medium">дата рождения:</span>
                                    <span class="text-weight-light q-ml-xs">{{ getReadableFormatFromTS(cardEmployee.birth) }} ({{ getAgeFromTS(cardEmployee.birth) }})</span>
                                </div>
                                <div class="text-body3 text-grey-7" v-if="cardEmployee.reg_date">
                                    <span class="text-weight-medium">дата регистрации:</span>
                                    <span class="text-weight-light q-ml-xs">{{ getReadableFormatFromTS(cardEmployee.reg_date) }}</span>
                                </div>
                                <div class="text-body3 text-grey-7">
                                    <span class="text-weight-medium">пол:</span>
                                    <span class="text-weight-light q-ml-xs">{{ genderOptions[cardEmployee.gender]?.label.toLocaleLowerCase() }}</span>
                                </div>
                                <div class="text-body3 text-grey-7">
                                    <span class="text-weight-medium">зарплата:</span>
                                    <span
                                    class="text-weight-light q-ml-xs"
                                    v-marker
                                    v-splitNumber="cardEmployee.salaryAmount ? cardEmployee.salaryAmount : 0"></span> руб.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-5 column justify-start items-end">
                    <!-- Контактный телефон -->
                    <div class="row flex justify-center">
                        <q-icon size="md" name="phone" class="text-primary" />
                        <span class="text-body1 q-ml-sm">{{ cardEmployee.phone }}</span>
                    </div>
                    <!-- email -->
                    <div class="row flex justify-center q-pt-sm">
                        <q-icon size="md" name="email" class="text-primary" />
                        <span class="text-body1 q-ml-sm">{{ cardEmployee.email }}</span>
                    </div>
                </div>
            </q-card-section>

            <q-separator color="lightgrey" />

            <q-card-section>
                <!-- Информация о компании -->
                <div class="row items-center">
                    <div class="col-3 q-pa-xs flex justify-center items-center">
                        <q-icon name="business" class="text-primary" />
                        <span class="text-body1 q-ml-md">{{ cardEmployee.company?.name }}</span>
                        <span v-if="cardEmployee.isManager()" class="subcaption q-ml-xs q-mt-xs">(руководитель)</span>
                    </div>
                    <div class="col-3 q-pa-xs flex justify-center items-center">
                        <q-icon name="work" class="text-primary q-ml-md" />
                        <span class="text-body1 q-ml-md">{{ cardEmployee.department?.name }}</span>
                    </div>
                    <div class="col-4 q-pa-xs flex justify-center items-center">
                        <div class="text-subtitle1 text-grey-10">
                            <template v-if="!$um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.EDIT)(R_FIELDS.POSITION)">Должность: {{ positionText }}</template>
                            <template v-else>
                                <q-select
                                    class="profile-card_select full-width"
                                    dense filled input-debounce="0"
                                    v-model="selectPositionModel"
                                    :options="selectPositionOptions"
                                    @update:model-value="onPositionSelect"
                                ></q-select>
                            </template>
                        </div>
                    </div>
                    <div class="col-2 q-pa-xs flex justify-center items-center">
                        <div class="text-subtitle1 text-grey-10">
                            {{ cardEmployee.state.label }}
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-separator color="lightgrey" />

            <q-card-section v-if="cardEmployee.bio.trim()">
                <!-- Краткое описание -->
                <div class="row">
                    <div class="col-12 q-pa-md text-italic">
                        <div class="text-body1">
                            {{ cardEmployee.bio }}
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-separator color="lightgrey" />

            <q-card-section>
                <!-- Навыки -->
                <div class="row" v-if="cardEmployee.skills.length > 0">
                    <div class="col-12 wrap">
                        <q-icon name="school" class="text-primary" />
                        <span class="text-body2 q-ml-sm q-mb-sm">Навыки:</span>
                        <user-skills
                            :skills="cardEmployee.skills"
                            :needAssession="false"
                            :removable="false"
                            :alwaysShowAll="true"
                            size="md"
                        ></user-skills>
                    </div>
                </div>
            </q-card-section>

            <!--Admin controls-->
            <employee-edit v-if="$um.can(R_ENTITIES.EMPLOYEE)(R_ACTIONS.EDIT)(R_FIELDS.ENTIRE)">
                <template #header>
                    <q-card-section class="bg-warning text-white q-pa-xs" :horizontal="true">
                        <div class="text-h6">Управление струдником</div>
                    </q-card-section>
                </template>
            </employee-edit>
        </q-card>
    </q-dialog>
</template>


<script lang="ts" setup>
import { computed, ref } from 'vue';
import { R_ACTIONS, R_ENTITIES, R_FIELDS, Rbac } from '@/entities/Rbac';
import { useUserProfileCard } from '@/composables/userProfileCard';
import { genderOptions } from '@/utils/constants/main';
import { getAgeFromTS, getReadableFormatFromTS } from '@/utils/helpers/dates';
import { getSelectOptionsFromDataArray } from '@/utils/helpers/components';
import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
import { SAVED_SUCCESS } from '@/utils/constants/texts';
import type { TResult } from '@/interfaces/Error';

import UserSkills from '@/components/UserSkills.vue'
import EmployeeEdit from '@/components/employee/EmployeeEdit.vue';
import type { IPosition } from '@/interfaces/User';


const notify = useNotify()
const $um = Rbac.getInstance()

const { isUserProfileCardOpened, cardEmployee, avatar } = useUserProfileCard()

const selectPositionModel = ref({
    label: cardEmployee.value?.position?.position,
    value: cardEmployee.value?.position?.id
})

const selectPositionOptions = computed(() => {
    return getSelectOptionsFromDataArray<IPosition>($um.company.positions, {
        idField: 'id',
        labelField: 'position'
    })
})
const positionText = computed(() => {
    if(cardEmployee.value === undefined || cardEmployee.value.position?.position === undefined){
        return 'не указана'
    }
    return cardEmployee.value.position.position
})
async function onPositionSelect(): Promise<void> {
    if(!selectPositionModel.value.value) return
    const res: TResult = await $um.company.changeEmployeePosition(selectPositionModel.value.value, cardEmployee.value.userId)
    if(res.error) {
        notify.run(res.errorMessage, notifyTypes.err)
        return
    }
    notify.run(SAVED_SUCCESS, notifyTypes.succ)
}
</script>



<style lang="scss" scoped>
.employee-card {
    max-width: 70%;
    min-height: 400px;
    max-height: auto;
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
        width: 100%;
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
</style>
