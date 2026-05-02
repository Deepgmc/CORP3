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
                :deal="deal"
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

        <q-carousel-slide name="taxLawSelection" class="no-wrap">
            <deals-payment-selection
                :caption="currentStep?.label"
                :deal="deal"
            ></deals-payment-selection>
        </q-carousel-slide>
    </q-carousel>

    <q-btn
        color="deep-orange"
        class="q-mt-sm q-mr-sm"
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

    <div>
        <q-btn v-if="deal.isDealSuccess()" class="q-mt-sm" color="primary">Оформить сделку</q-btn>
    </div>

    <q-separator class="q-ma-lg"></q-separator>

<pre>
partnerCompanyId: {{ deal.partnerCompanyId }}
partnerId: {{ deal.partnerId }}
ownerCompanyId: {{ deal.ownerCompanyId }}
ownerId: {{ deal.ownerId }}

<br>
currentStep: {{ currentStep }}
<br>
deal.selectedPartnerOwner: {{ deal.selectedPartnerOwner }}
</pre>
</template>

<script setup lang="ts">
    import { computed, inject, ref, type Ref } from 'vue'
    import { Deal } from '@/entities/Deal';
    import type { Rbac } from '@/entities/Rbac';
    import { rbacSym } from '@/utils/injecttionSymbols';
    import DealsPartnerSelection from './DealsPartnerSelection.vue';
    import DealsWarehouseSelection from './DealsWarehouseSelection.vue';
    import DealsPaymentSelection from './DealsPaymentSelection.vue';
    import type { Employee } from '@/entities/Employee';
    import type { ICompany } from '@/interfaces/Company';
    import type Product from '@/entities/warehouse/Product';

    const $userManager = inject<Rbac>(rbacSym) as Rbac
    const user = $userManager.getUser()
    const deal = ref(new Deal(user.userId, user.company.id)) as Ref<Deal>

    const currentStep = ref(deal.value.getStep(1))

    if(!user.companyId || currentStep.value === undefined){
        throw new Error('Unexpected error')
    }

    const showPrevButton = computed(() => {
        return currentStep.value && currentStep.value.order > 1
    })
    const showNextButton = computed(() => {
        return currentStep.value && currentStep.value.isSuccess && currentStep.value.order < deal.value.steps.length
    })

    const slide = ref<string>(currentStep.value.id)

    function changeStep(increment: number) {
        if(currentStep.value === undefined) return
        const nextStep = deal.value.getStep(currentStep.value.order + increment)
        if(nextStep === undefined) return

        slide.value = nextStep.id
        currentStep.value = nextStep
    }

    function pushToDeferredWarehouse(newProduct: Product) {
        deal.value.pushToDeferredWarehouse(newProduct)
        deal.value.setWarehouseSelectedSuccess()
    }

    function partnerSelected(selectedPartner: ICompany, selectedPartnerOwner: Employee) {
        deal.value.setPartnerSelectedSuccess(selectedPartner, selectedPartnerOwner)
    }

    function resetPartnerCopmpany(){
        deal.value.resetPartnerCompany()
    }

</script>

<style scoped lang="scss">
    .new-deal-container {
        height: 600px;
    }
</style>
