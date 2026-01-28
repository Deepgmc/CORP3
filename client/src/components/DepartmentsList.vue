<template>
    <h4>Департаменты</h4>
    <div class="row">
        <div class="col">
            <grid-view
                v-if="departments && departments.length"
                :cols="departmentColsMap"
                :data="deptComputed"
                :idName="'id'"
            >
                <template #actions_caption>
                    <q-icon class="gv-edit_buttons" name="edit" />
                </template>

                <template #actions_buttons="slotProps">
                    <q-icon
                        class="gv-edit_buttons"
                        name="delete_forever"
                        @click="deleteDepartment"
                        :data-itemId="slotProps.itemId" />
                </template>
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
                    dense
                    filled
                    :rules="[val => !!val || v_msg.REQUIRED]"
                ></q-input>
                <q-input
                    dense
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
const needFields = ['name', 'description']
const departmentColsMap = setColsMap(needFields, departmentBaseMap, departmentAvailableCols)

const departments = $authManager.company.departments

const deptComputed = computed(() => {
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

async function deleteDepartment(e: MouseEvent) {
    if(e.target instanceof HTMLElement){
        const itemId: number = Number(e.target.dataset.itemid)
        if(itemId && Number.isInteger(itemId)){
            await $authManager.company.deleteDepartment(Number(itemId))
        }
    }
}
</script>

<style lang="scss">
    .add-department-ta{
        resize: none;
    }
</style>
