<template>
    <div>
        <q-select
            filled
            :options="selectOptions"
            emit-value
            map-options
            label="Выберите компанию"
            v-model="partnerCompanyId"
        >
            <template #no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        Ничего не найдено
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
    </div>
</template>

<script setup lang="ts">
    import { useDictStore } from '@/stores/dictStore'
    import { getSelectOptionsFromDataArray } from '@/utils/helpers/components'
    import type { ICompany } from '@/interfaces/Company'

    const partnerCompanyId = defineModel<number>()

    const { companies } = useDictStore()
    const selectOptions = getSelectOptionsFromDataArray<ICompany>(companies.getData(), {
            idField   : 'id',
            labelField: 'name'
        });

</script>
