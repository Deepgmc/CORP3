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
                <div class="gt-md">
                    {{ deal.selectedPartnerOwner?.firstName }}
                    {{ deal.selectedPartnerOwner?.lastName }}
                    {{ deal.selectedPartnerOwner?.username }} ({{ deal.selectedPartnerOwner?.userId }})
                </div>
            </q-bar>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, inject, watch } from 'vue'
    import type { Rbac } from '@/entities/Rbac'
    import { rbacSym } from '@/utils/injecttionSymbols'
    import type { Employee } from '@/entities/Employee'
    import { notifyTypes, useNotify } from '@/composables/notifyQuasar'
    import CompanySelectionComponent from '@/components/CompanySelectionComponent.vue'
    import { useDictStore } from '@/stores/dictStore'
    import type { Deal } from '@/entities/Deal'

    const $userManager = inject<Rbac>(rbacSym) as Rbac
    const notify = useNotify()
    const { companies: companiesDict } = useDictStore()

    const partnerCompanyId = defineModel<number>('partnerCompanyId')
    const partnerId = defineModel<number>('partnerId')
    const props = defineProps<{
        caption?: string,
        deal: Deal,
    }>()
    const emit = defineEmits(['reset-partner-company', 'partner-selected-success'])

    //всё ли в порядке при выборе компании. показываем выбранную и кнопку перехода на следующую стадию
    const isSelectedSuccess = computed(() => {
        return props.deal.selectedPartner && props.deal.selectedPartnerOwner
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
            emit('partner-selected-success', companiesDict.getItemById(selectedCompanyId), owner)
        } else {
            emit('reset-partner-company')
            notify.run('Ошибка определения владельца компании', notifyTypes.err)
            return
        }
    }
</script>

<style lang="scss"></style>
