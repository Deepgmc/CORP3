<template>
    <h4>Департаменты</h4>
    <div class="row">
        <div class="col">
            <grid-view
                v-if="departments && departments.length"
                :cols="departmentColsMap"
                :data="deptComputed"
                :idName="'id'"
                module="company"
                action="departments"
            >
                <template #actions_caption>
                    <q-icon class="gv-edit_buttons" name="edit" />
                </template>

                <template #actions_buttons="slotProps">
                    <q-icon
                        class="gv-edit_buttons"
                        name="delete_forever"
                        @click="deleteDepartment"
                        :data-itemId="slotProps.itemId"
                    />
                </template>
            </grid-view>
        </div>
    </div>

    <div class="row q-mt-lg justify-between">
        <div
            v-for="dept in departments"
            :key="dept.id"
            class="GT_block"
        >
            <div class="GT_label" dropable="true">
                <p>{{ dept.name }}</p>
            </div>
            <div class="GT_users">
                <div
                    v-for="empl in employees.filter((empl: IUser) => empl.departmentId === dept.id)"
                    :key="empl.userId"
                    draggable="true"
                    class="GT_user"
                >
                    <div>{{ empl.username }}</div><div>{{ empl.firstName }} {{ empl.lastName }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="row q-mt-lg">
        <div class="col-8 offset-2">
            <q-form @submit="addDepartment">
                <fieldset class="fieldset">
                    <legend class="text-h5">Добавить новый департамент</legend>
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
                </fieldset>
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
import type { IUser } from '@/interfaces/User';

const $authManager = AuthManager.getInstance()
const needFields = ['id', 'name', 'description', 'companyId', 'countusers']
const departmentColsMap = setColsMap(needFields, departmentBaseMap, departmentAvailableCols)

const departments = $authManager.company.departments
const employees = $authManager.company.employees

const deptComputed = computed(() => {
    return modifyGridData([...departments], departmentColsMap)
})

const newDepartment = reactive<IAddDepartment>({
    name: '',
    description: '',
    companyId: $authManager.company.companyId
})

function addDepartment() {
    $authManager.company.addNewDepartment(newDepartment)
    .then(() => {
        newDepartment.name = ''
        newDepartment.description = ''
    })
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
    .GT_block {
        border:3px solid red;
        width:330px;
        margin-bottom:20px;
        display:flex;
        flex-wrap: nowrap;
        flex-direction: column;
        align-items: flex-start;
        justify-content: start;
        .GT_label{
            width:100%;
            display:flex;
            padding: 20px 0 20px 0;
            justify-content: center;
            align-items: center;
            background: green;
            height:150px;
        }
        .GT_users{
            width:100%;
            // border:1px solid blue;
            display:flex;
            flex-direction: column;
            align-items:center;
            justify-content: center;
        }
        .GT_user{
            border:1px solid rgb(121, 114, 212);
            min-height: 50px;
            min-width: 70%;
            text-align: center;
            cursor:crosshair;
        }
    }

</style>
