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
                        <img :src="avatar" :alt="`${dialogUser.firstName} ${dialogUser.lastName}`">
                    </q-avatar>
                    <div class="column justify-center q-ml-xl">
                        <div class="text-h5 text-weight-bold">
                            {{ dialogUser.firstName }} {{ dialogUser.lastName }}
                        </div>
                        <div class="text-subtitle1 text-grey-10">
                            <template v-if="!$um.can(R_ENTITIES.USER)(R_ACTIONS.EDIT)(R_FIELDS.POSITION)">Должность: {{ positionText }}</template>
                            <template v-else>
                                <q-select
                                    dense
                                    filled
                                    v-model="selectPositionModel"
                                    :options="selectPositionOptions"
                                    input-debounce="0"
                                    @update:model-value="onPositionSelect"
                                ></q-select>
                            </template>
                        </div>
                        <div class="text-body3 text-grey-7">
                            дата рождения: {{ getReadableFormatFromTS(dialogUser.birth) }} ({{ getAgeFromTS(dialogUser.birth) }})
                        </div>
                        <div class="text-body3 text-grey-7">
                            пол: {{ genderOptions[dialogUser.gender]?.label }}
                        </div>
                    </div>
                </div>

                <!-- Информация о компании -->
                <div class="row q-mt-lg">
                    <div class="col-auto">
                        <q-icon name="business" class="text-primary" />
                        <span class="text-body1 q-ml-xs">{{ dialogUser.company?.name }}</span>
                        <span v-if="dialogUser.isDirector" class="subcaption">(руководитель)</span>
                    </div>
                    <div class="col-auto">
                        <q-icon name="work" class="text-primary q-ml-md" />
                        <span class="text-body1 q-ml-xs">{{ dialogUser.department?.name }}</span>
                    </div>
                </div>

                <!-- Краткое описание -->
                <q-card v-if="dialogUser.bio.trim()" flat bordered class="bg-grey-2">
                    <q-card-section>
                        <div class="text-body1">
                            {{ dialogUser.bio }}
                        </div>
                    </q-card-section>
                </q-card>

                <!-- Контактный телефон -->
                <div v-if="dialogUser.phone">
                    <q-icon name="phone" class="text-primary" />
                    <span class="text-body2 q-ml-sm">{{ dialogUser.phone }}</span>
                </div>
                <!-- email -->
                <div v-if="dialogUser.email">
                    <q-icon name="email" class="text-primary" />
                    <span class="text-bod2 q-ml-sm">{{ dialogUser.email }}</span>
                </div>

                <!-- Навыки -->
                <div v-if="dialogUser.skills.length > 0">
                    <q-icon name="school" class="text-primary" />
                    <span class="text-body2 q-ml-sm q-mb-sm">Навыки:</span>
                    <user-skills
                        :skills="dialogUser.skills"
                        :needAssession="false"
                        :removable="false"
                        :alwaysShowAll="true"
                        size="md"
                    ></user-skills>
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

const { isUserProfileCardOpened, dialogUser, avatar } = useUserProfileCard()

const selectPositionModel = ref({
    label: dialogUser.value?.position?.position,
    value: dialogUser.value?.position?.id
})

const selectPositionOptions = computed(() => {
    return getSelectOptionsFromDataArray<IPosition>($um.company.positions.value, {
        idField: 'id',
        labelField: 'position'
    })
})
const positionText = computed(() => {
    if(dialogUser.value.position?.position === undefined) {
        return 'не указана'
    }
    return dialogUser.value.position.position
})
async function onPositionSelect(): Promise<void> {
    if(!selectPositionModel.value.value) return
    const res: TResult = await $um.changeUserPosition(selectPositionModel.value.value, dialogUser.value.userId)
    if(res.error) {
        notify.run(res.errorMessage, notifyTypes.err)
        return
    }
    notify.run(SAVED_SUCCESS, notifyTypes.succ)
}
</script>



<style scoped>
.employee-card {
    max-width: 900px;
    min-width: 600px;
    min-height: 400px;
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
</style>
