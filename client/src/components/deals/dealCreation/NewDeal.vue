<template>
    <!-- navigation-position="bottom" navigation -->
    <q-carousel
        v-model="slide"
        animated
        control-type="unelevated"
        class="new-deal-container bg-green rounded-borders"
    >
        <q-carousel-slide name="partnerSelection" class="no-wrap">
            <deals-partner-selection
                v-model:partnerId="deal.partnerId"
                v-model:partnerCompanyId="deal.partnerCompanyId"
                :caption="currentStep?.label"
                @reset-partner-company="resetPartnerCopmpany"
                @partner-selected-success="partnerSelected"
            ></deals-partner-selection>
        </q-carousel-slide>

        <q-carousel-slide name="productSelection" class="no-wrap">
            <deals-warehouse-selection
                :caption="currentStep?.label"
                :deal="deal"
                @add-product-to-deferred="pushToDeferredWarehouse"
            ></deals-warehouse-selection>
        </q-carousel-slide>
    </q-carousel>

    <q-btn
        color="deep-orange"
        class="q-mt-sm"
        v-if="showPrevButton"
        @click="changeStep(-1)"
    >
        Назад
    </q-btn>

    <q-btn
        color="deep-orange"
        class="q-mt-sm"
        v-if="showNextButton"
        @click="changeStep(+1)"
    >
        Далее
    </q-btn>

    <q-separator class="q-ma-lg"></q-separator>

<pre>
partnerCompanyId: {{ deal.partnerCompanyId }}
partnerId: {{ deal.partnerId }}
currentStep: {{ currentStep }}
ownerCompanyId: {{ deal.ownerCompanyId }}
ownerId: {{ deal.ownerId }}
</pre>
</template>

<script setup lang="ts">
    import { computed, inject, ref } from 'vue'
    import { Deal } from '@/entities/Deal';
    import type { Rbac } from '@/entities/Rbac';
    import { rbacSym } from '@/utils/injecttionSymbols';
    import DealsPartnerSelection from './DealsPartnerSelection.vue';
    import DealsWarehouseSelection from './DealsWarehouseSelection.vue';
    import type { Employee } from '@/entities/Employee';
    import type { ICompany } from '@/interfaces/Company';
    import type Product from '@/entities/warehouse/Product';

    const $userManager = inject<Rbac>(rbacSym) as Rbac
    const user = $userManager.getUser()
    const deal = new Deal(user.userId, user.company.id)
    const currentStep = ref(deal.getStep(2))

    if(!user.companyId || currentStep.value === undefined){
        throw new Error('Unexpected error')
    }

    const showPrevButton = computed(() => {
        return currentStep.value && currentStep.value.order > 1
    })
    const showNextButton = computed(() => {
        return currentStep.value && currentStep.value.isSuccess
    })

    const slide = ref<string>(currentStep.value.id)

    function changeStep(increment: number) {
        if(currentStep.value === undefined) return
        const nextStep = deal.getStep(currentStep.value.order + increment)
        if(nextStep === undefined) return

        slide.value = nextStep.id
        currentStep.value = nextStep
    }

    function pushToDeferredWarehouse(newProduct: Product) {
        deal.pushToDeferredWarehouse(newProduct)
    }

    function partnerSelected(selectedPartner: ICompany, selectedPartnerOwner: Employee){
        deal.setPartnerSelectedSuccess(selectedPartner, selectedPartnerOwner)
    }

    function resetPartnerCopmpany(){
        deal.resetPartnerCompany()
    }

</script>

<style scoped lang="scss">
    .new-deal-container {
        height: 600px;
    }
</style>
