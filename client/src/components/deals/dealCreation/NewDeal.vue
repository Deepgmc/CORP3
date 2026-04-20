<template>
    <!-- navigation-position="bottom" navigation -->
    <q-carousel
        v-model="slide"
        animated
        control-type="unelevated"
        class="new-deal-container bg-green text-white rounded-borders"
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
            <deals-warehouse-selection></deals-warehouse-selection>
        </q-carousel-slide>
    </q-carousel>

    <q-btn
        color="deep-orange"
        class="q-mt-sm"
        v-if="showPrevButton"
        @click="goPrev"
    >
        Назад
    </q-btn>

    <q-btn
        color="deep-orange"
        class="q-mt-sm"
        v-if="showNextButton"
        @click="goNext"
    >
        Далее
    </q-btn>

    <q-separator class="q-ma-lg"></q-separator>

    <div>partnerCompanyId: {{ deal.partnerCompanyId }}</div>
    <div>partnerId: {{ deal.partnerId }}</div>
    <div>currentStep: {{ currentStep }}</div>
    <div>ownerCompanyId: {{ deal.ownerCompanyId }}</div>
    <div>ownerId: {{ deal.ownerId }}</div>
</template>

<script setup lang="ts">
    import { computed, inject, ref } from 'vue'
    import { Deal } from '@/entities/Deal';
    import type { Rbac } from '@/entities/Rbac';
    import { rbacSym } from '@/utils/injecttionSymbols';
    import DealsPartnerSelection from './DealsPartnerSelection.vue';
    import DealsWarehouseSelection from './DealsWarehouseSelection.vue';

    const $userManager = inject<Rbac>(rbacSym) as Rbac
    const user = $userManager.getUser()
    const deal = ref(new Deal(user.userId, user.company.companyId))
    const currentStep = ref(deal.value.getStep(1))

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

    function goNext(){
        if(currentStep.value === undefined) return
        const nextStep = deal.value.getStep(currentStep.value.order + 1)
        if(nextStep === undefined) return

        slide.value = nextStep.id
        currentStep.value = nextStep
    }

    function goPrev(){
        if(currentStep.value === undefined) return
        const nextStep = deal.value.getStep(currentStep.value.order - 1)
        if(nextStep === undefined) return

        slide.value = nextStep.id
        currentStep.value = nextStep
    }

    function partnerSelected(){
        deal.value.setPartnerSelectedSuccess()
    }

    function resetPartnerCopmpany(){
        deal.value.resetPartnerCompany()
    }

</script>

<style scoped lang="scss">
    .new-deal-container {
        height: auto;
    }
</style>
