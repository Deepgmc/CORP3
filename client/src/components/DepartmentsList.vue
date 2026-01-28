<template>
    <h3>Департаменты</h3>
    <div class="row">
        <div class="col">
            <grid-view
                v-if="departments && departments.length"
                :cols="departmentColsMap"
                :data="deptComp"
                :idName="'id'"
            >
            </grid-view>
        </div>
    </div>

    <div class="row q-mt-xl">
        <div class="col">
            <div class="text-h5">Добавить новый департамент</div>
            <q-form @submit="addDepartment">
                <q-input
                    v-model="newDepartment.name"
                    label="Название"
                    class="q-mb-md add-department-ta"
                    filled
                    :rules="[val => !!val || v_msg.REQUIRED]"
                ></q-input>
                <q-input
                    filled
                    type="textarea"
                    v-model="newDepartment.description"
                    label="Описание"
                    :rules="[
                        val => !val || val.length <= 100 || 'Максимум 100 символов'
                    ]"
                />

                <div class="row q-gutter-sm">
                    <q-btn class="q-mt-lg" label="Сохранить" type="submit" color="primary" />
                </div>
            </q-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import GridView from './grid/GridView.vue';
import { AuthManager } from '@/auth/AuthManager';
import type { IAddDepartment } from '@/interfaces/Company';
import { modifyGridData, setColsMap, departmentBaseMap, departmentAvailableCols } from '@/components/grid/GridColumnOptionTypes';
import { v_msg } from '@/utils/constants/texts';

const $authManager = AuthManager.getInstance()
const needFields = ['id', 'name', 'description', 'companyId']
const departmentColsMap = setColsMap(needFields, departmentBaseMap, departmentAvailableCols)

const departments = $authManager.company.departments

const deptComp = computed(() => {
    return modifyGridData([...departments], departmentColsMap)
})

const newDepartment = reactive<IAddDepartment>({
    name: '',
    description: '',
    companyId: $authManager.company.companyId
})

async function addDepartment() {
    await $authManager.company.addNewDepartment(newDepartment)
    newDepartment.name = ''
    newDepartment.description = ''
}
</script>

<style lang="scss">
    .add-department-ta{
        resize: none;
    }
</style>
