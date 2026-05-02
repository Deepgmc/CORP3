<template>
    <div class="row q-mb-md">
        <div class="col-12"><span class="text-h5">{{ props.caption || '' }}</span></div>
    </div>
    <div class="row q-mb-md">
        <div class="col-12 col-md-3">Сумма отгружаемого товара</div>
        <div class="col-12 col-md-9">{{ props.deal.deferredTransactionAmount() }}</div>
    </div>
    <div class="row q-mb-md">
        <div class="col-12 col-md-3">НДС</div>
        <div class="col-12 col-md-9">{{ ndsTax }}%</div>
    </div>
    <div class="row q-mb-md">
        <div class="col-12 col-md-3">Транспортные отчиследния</div>
        <div class="col-12 col-md-9">{{ transportTax }}%</div>
    </div>
    <div class="row q-mb-md">
        <div class="col-12 col-md-3">Начислить скидку</div>
        <div class="col-12 col-md-9"><q-input dense v-model="discount" type="number" /></div>
    </div>
    <div class="row q-mb-md">
        <div class="col-12 col-md-3">Финальная сумма продажи товара</div>
        <div class="col-12 col-md-9"><q-input dense v-model="finalAmount" type="number" /></div>
    </div>
    <div class="row q-mb-md">
        <div class="col-12 col-md-3">Оформить сопроводительное письмо</div>
        <div class="col-12 col-md-9"><q-checkbox dense v-model="isNeedDocument" /></div>
    </div>

    <div class="row q-mb-md">
        <q-btn color="primary" @click="successTaxStep">Подтвердить</q-btn>
    </div>
</template>

<script setup lang="ts">
    import type { Deal } from '@/entities/Deal';
    import { computed, ref } from 'vue';
    const props = defineProps<{
        caption?: string,
        deal: Deal,
    }>()

    const ndsTax = 22
    const transportTax = 5
    const discount = ref<number>(0)
    const isNeedDocument = ref<boolean>(false)

    const finalAmount = computed(() => {
        const base = props.deal.deferredTransactionAmount()
        return base - discount.value - Math.round(base * ndsTax / 100) - Math.round(base * transportTax / 100)
    })

    function successTaxStep(){
        const thisStep = props.deal.getStep('taxLawSelection')
        if(thisStep){
            thisStep.isSuccess = true
        }
    }
</script>

<style lang="scss">

</style>
