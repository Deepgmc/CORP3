<template>
    <q-dialog v-model="isUserProfileCardOpened">
        <q-card class="employee-card q-ma-md" flat bordered>
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Профиль сотрудника</div>
            </q-card-section>

            <q-card-section class="q-gutter-y-md">
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
                            дата рождения: {{ getReadableFormatFromTS(dialogEmployee.birth) }} ({{ getAgeFromTS(dialogEmployee.birth) }})
                        </div>
                        <div class="text-body3 text-grey-7" v-if="dialogEmployee.reg_date">
                            дата регистрации: {{ getReadableFormatFromTS(dialogEmployee.reg_date) }}
                        </div>
                        <div class="text-body3 text-grey-7">
                            пол: {{ genderOptions[dialogEmployee.gender]?.label }}
                        </div>
                    </div>
                </div>

                <!-- Информация о компании -->
                <div class="row q-mt-lg items-center">
                    <div class="col-4 q-pa-xs flex">
                        <div class="text-subtitle1 text-grey-10">
                            <template v-if="!$um.can(R_ENTITIES.USER)(R_ACTIONS.EDIT)(R_FIELDS.POSITION)">Должность: {{ positionText }}</template>
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
                    <div class="col-4 q-pa-xs">
                        <q-icon name="business" class="text-primary" />
                        <span class="text-body1 q-ml-xs">{{ dialogEmployee.company?.name }}</span>
                        <span v-if="dialogEmployee.isManager()" class="subcaption"> (руководитель)</span>
                    </div>
                    <div class="col-4 q-pa-xs">
                        <q-icon name="work" class="text-primary q-ml-md" />
                        <span class="text-body1 q-ml-xs">{{ dialogEmployee.department?.name }}</span>
                    </div>
                </div>

                <!-- Краткое описание -->
                <div class="row">
                    <q-card v-if="dialogEmployee.bio.trim()" flat bordered class="bg-grey-2">
                        <q-card-section>
                            <div class="text-body1">
                                {{ dialogEmployee.bio }}
                            </div>
                        </q-card-section>
                    </q-card>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <!-- Контактный телефон -->
                            <div class="col-6">
                                <q-icon name="phone" class="text-primary" />
                                <span class="text-body2 q-ml-sm">{{ dialogEmployee.phone }}</span>
                            </div>
                            <!-- email -->
                            <div class="col-6">
                                <q-icon name="email" class="text-primary" />
                                <span class="text-bod2 q-ml-sm">{{ dialogEmployee.email }}</span>
                            </div>
                        </div>
                    </div>
                </div>

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

                <!--Admin controls-->
                <div class="row">
                    <div class="col-12 flex justify-end">
                        <q-icon
                            v-if="
                                $um.can(R_ENTITIES.USER)(R_ACTIONS.EDIT)(R_FIELDS.HIRE)
                            "
                            name="thumb_up" size="md" class="q-ml-sm pointer text-secondary"
                        />

                        <q-icon
                            v-if="
                                $um.can(R_ENTITIES.USER)(R_ACTIONS.EDIT)(R_FIELDS.FIRE)
                            "
                            name="highlight_off" size="md" class="q-ml-sm pointer text-negative"
                        />

                        <q-icon
                            v-if="$um.can(R_ENTITIES.USER)(R_ACTIONS.VIEW)(R_FIELDS.ENTIRE)"
                            name="calendar_month" size="md" class="q-ml-sm pointer text-info"
                        />
                    </div>
                </div>
            </q-card-section>
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
const notify = useNotify()
const $um = Rbac.getInstance()

const { isUserProfileCardOpened, dialogEmployee, avatar } = useUserProfileCard()

const selectPositionModel = ref({
    label: dialogEmployee.value?.position?.position,
    value: dialogEmployee.value?.position?.id
})

const selectPositionOptions = computed(() => {
    return getSelectOptionsFromDataArray<IPosition>($um.company.positions.value, {
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
    max-width: 900px;
    min-height: 400px;
    .profile-card_select {
        width:250px;
    }
}

.employee-card .q-card__section {
    padding: 24px;
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
