<template>
    <div class="col-6">
        <span class="text-h5">{{ props.caption || '' }}</span>

        <company-selection-component
            v-model="partnerCompanyId"
        />

        <div class="column flex-left q-mt-lg" v-if="isSelectedSuccess">
            <q-bar>
                <q-btn dense flat icon="account_circle" />
                <div class="text-weight-bold">Контакт контрагента:</div>
                <div class="cursor-pointer gt-md">{{ selectedPartnerOwner?.firstName }} {{ selectedPartnerOwner?.lastName }}</div>
            </q-bar>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { computed, inject, ref, watch } from 'vue'
    import type { Rbac } from '@/entities/Rbac'
    import { rbacSym } from '@/utils/injecttionSymbols'
    import type { Employee } from '@/entities/Employee'
    import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
    import CompanySelectionComponent from '@/components/CompanySelectionComponent.vue'
    import { useDictStore } from '@/stores/dictStore'
    import type { ICompany } from '@/interfaces/Company'

    const $userManager = inject<Rbac>(rbacSym) as Rbac
    const notify = useNotify()
    const { companies: companiesDict } = useDictStore()

    const partnerCompanyId = defineModel<number>('partnerCompanyId')
    const partnerId = defineModel<number>('partnerId')
    const props = defineProps<{caption?: string}>()
    const emit = defineEmits(['reset-partner-company', 'partner-selected-success'])

    const selectedPartner = ref<ICompany>()
    const selectedPartnerOwner = ref<Employee>()

    //всё ли в порядке при выборе компании. показываем выбранную и кнопку перехода на следующую стадию
    const isSelectedSuccess = computed(() => {
        return partnerId.value && partnerId.value > 0 && partnerCompanyId.value && partnerCompanyId.value > 0
    })

    //ищем владельца компании при её выборе
    watch(partnerCompanyId, () => {
        if(partnerCompanyId.value !== undefined) getPartnerOwner(partnerCompanyId.value)
    })

    async function getPartnerOwner(selectedCompanyId: number): Promise<void> {
        if($userManager.company.isMyCompany(selectedCompanyId)){
            emit('reset-partner-company')
            notify.run('Нельзя выбрать свою компанию', notifyTypes.err)
            return
        }

        const owner: Employee | undefined = await $userManager.company.loadCompanyOwnerUser(selectedCompanyId)
        if(owner && owner.userId > 0) {
            partnerId.value = owner.userId
            selectedPartner.value = companiesDict.getItemById(selectedCompanyId)
            selectedPartnerOwner.value = owner
            emit('partner-selected-success', selectedPartner.value, selectedPartnerOwner.value)
        } else {
            emit('reset-partner-company')
            notify.run('Ошибка определения владельца компании', notifyTypes.err)
            return
        }
    }
</script>

<style lang="scss"></style>
