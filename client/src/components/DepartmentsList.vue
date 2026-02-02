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

    <div class="row q-mt-lg justify-between">
        <div
            class="GT_block"
            v-for="dept in deptsDndList"
            :key="dept[0].id"
        >
            <div
                class="GT_label"
                @drop="dropUser($event)"
                @dragenter.prevent=""
                @dragover.prevent=""
                :data-deptid="dept[0].id"
            >
                <p>{{ dept[0].name }}</p>
            </div>
            <div class="GT_users">
                <div
                    v-for="empl in dept[1]"
                    :key="empl.userId"
                    draggable="true"
                    class="GT_user"
                    :data-deptid="dept[0].id"
                    @dragstart="dragItem($event, empl)"
                >
                    <div>{{ empl.username }}</div><div>{{ empl.firstName }} {{ empl.lastName }}</div>
                </div><!--employees v-for-->
            </div>
        </div><!--departments v-for-->
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, type Ref } from 'vue';
import GridView from './grid/GridView.vue';
import { AuthManager } from '@/auth/AuthManager';
import type { IAddDepartment, IDepartment } from '@/interfaces/Company';
import { modifyGridData, setColsMap, departmentBaseMap, departmentAvailableCols } from '@/components/grid/GridColumnOptionTypes';
import { v_msg } from '@/utils/constants/texts';
import type { IUser } from '@/interfaces/User';

import { dragItem, dropItem } from '@/composables/dnd'

const $authManager = AuthManager.getInstance()
const needFields = ['id', 'name', 'description', 'companyId', 'countusers']
const departmentColsMap = setColsMap(needFields, departmentBaseMap, departmentAvailableCols)

const departments = $authManager.company.departments
const employees = $authManager.company.employees


/**
 * создаём итерируемый реактивный Map для вывода виджета сотрудников департаментов с перетаскиванием
 */
const deptsDndList: Ref<Map<IDepartment, IUser[]>> = computed(() => {
    const list = new Map()
    departments.value.forEach((dept: IDepartment) => {
        const emps = employees.value.filter((emp: IUser) => emp.departmentId === dept.id)
        list.set(dept, emps)
    })
    return list
})


//перемещаем юзера между департаментами
function dropUser(event: DragEvent){

    //непосредственно днд обрабатываем тут
    const dropResult = dropItem(event)

    //а работу с данными проводим дальше
    if(typeof dropResult === 'boolean') {
        return dropResult
    }
    const {dropId, dragItemId, dragFromId} = dropResult

    employees.value.forEach((thisEmp: IUser) => {
        if(thisEmp.userId === dragItemId && thisEmp.departmentId === dragFromId) {
            $authManager.company.switchUserDepartmets(thisEmp, dragFromId, dropId)
            return true
        }
    })
}


const deptComputed = computed(() => {
    return modifyGridData([...departments.value], departmentColsMap)
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
