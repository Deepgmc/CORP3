<template>
    <q-select
        filled
        v-model="modelCompanyId"
        :options="selectOptions"
        emit-value
        map-options
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Выберите компанию"
    >
        <template #no-option>
            <q-item>
                <q-item-section class="text-grey">
                    Ничего не найдено
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script setup lang="ts">
    import { useDictStore } from '@/stores/dictStore'
    import { getSelectOptionsFromDataArray } from '@/utils/helpers/components'
    import type { ICompany } from '@/interfaces/Company'
    const modelCompanyId = defineModel<number>('modelCompanyId')
    const { companies } = useDictStore()
    const selectOptions = getSelectOptionsFromDataArray<ICompany>(companies.getData(), {
            idField: 'companyId',
            labelField: 'name'
        });
</script>
