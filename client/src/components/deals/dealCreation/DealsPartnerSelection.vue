<template>
    <div class="col-6">
        <h5>{{ props.caption || '' }}</h5>

        <company-selection-component
            v-model="modelCompanyId"
        />

        <div class="column flex-left" v-if="isSelectedSuccess">
            <div>
            partnerCompanyId (partnerSelection): {{ partnerCompanyId }}<br>
            </div>
            <div>
            partnerId (partnerSelection): {{ partnerId }}
            </div>
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

    const modelCompanyId = defineModel<number>('partnerCompanyId')
    const partnerId = defineModel<number>('partnerId')
    const props = defineProps<{caption?: string}>()
    const emit = defineEmits(['reset-partner-company', 'partner-selected-success'])

    const selectedCompany = ref<ICompany>()

    //всё ли в порядке при выборе компании. показываем выбранную и кнопку перехода на следующую стадию
    const isSelectedSuccess = computed(() => {
        return partnerId.value && partnerId.value > 0 && modelCompanyId.value && modelCompanyId.value > 0
    })

    watch(isSelectedSuccess, () => {
        if(isSelectedSuccess.value) {
            emit('partner-selected-success')
        }
    })

    //ищем владельца компании при её выборе
    watch(modelCompanyId, () => {
        if(modelCompanyId.value !== undefined) getPartnerOwner(modelCompanyId.value)
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
            console.log('companiesDict.companies:', companiesDict)
            selectedCompany.value = companiesDict
        } else {
            emit('reset-partner-company')
            notify.run('Ошибка определения владельца компании', notifyTypes.err)
            return
        }
    }
</script>

<style lang="scss"></style>
