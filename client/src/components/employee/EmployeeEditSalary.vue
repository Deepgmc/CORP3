<template>
    <div class="text-h4 q-mb-md">Зарплата</div>
    <div class="form_container">
        <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
                v-model="salaryAmount"
                type="number"
                label="зарплата в месяц"
                outlined
                dense
                :rules="[
                    val => !!val || v_msg.REQUIRED,
                    val => val > 0 || v_msg.WRONG_VALUE,
                    val => val < Employee.maxSalaryValue || v_msg.WRONG_VALUE
                ]"
                prefix="₽"
            />

            <div class="row justify-end">
                <q-btn
                    type="submit"
                    color="primary"
                    label="Сохранить"
                    icon="save"
                    unelevated
                />
            </div>
        </q-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IUser } from '@/interfaces/User'
import { v_msg } from '@/utils/constants/texts.ts'
import { Employee } from '@/entities/Employee'

const emit = defineEmits(['set-salary'])
const props = defineProps<{
    cardEmployee: IUser
}>()

const salaryAmount = ref(props.cardEmployee.salaryAmount)

function onSubmit() {
    emit('set-salary', salaryAmount.value)
}
</script>
