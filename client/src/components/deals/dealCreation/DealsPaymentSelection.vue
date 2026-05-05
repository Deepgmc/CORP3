<template>
  <div class="q-pa-md q-gutter-y-sm">
    <!-- Заголовок -->
    <div class="text-h5 text-weight-medium text-center q-mb-lg">
        {{ props.caption || 'Расчёт платежей' }}
    </div>

    <!-- Сумма товара -->
    <div class="row items-center q-py-sm">
        <div class="col-6 col-md-3 text-grey-8">Сумма отгружаемого товара</div>
        <div class="col-6 col-md-3 text-weight-bold text-right">
            {{ formatCurrency(props.deal.deferredTransactionAmount()) }}
        </div>
    </div>

    <!-- НДС -->
    <div class="row items-center q-py-sm">
        <div class="col-6 col-md-3 text-grey-8">НДС ({{ ndsTax }}%)</div>
        <div class="col-6 col-md-3 text-negative text-right">
            -{{ formatCurrency(calculateTax(props.deal.deferredTransactionAmount(), ndsTax)) }}
        </div>
    </div>

    <!-- Транспортные отчисления -->
    <div class="row items-center q-py-sm">
        <div class="col-6 col-md-3 text-grey-8">Транспортные отчисления ({{ transportTax }}%)</div>
        <div class="col-6 col-md-3 text-orange text-right">
            -{{ formatCurrency(calculateTax(props.deal.deferredTransactionAmount(), transportTax)) }}
        </div>
    </div>

    <!-- Скидка -->
    <div class="row items-center q-py-sm">
        <div class="col-6 col-md-3 text-grey-8">Скидка</div>
        <div class="col-6 col-md-3 text-right">
        <q-input
            dense
            outlined
            v-model.number="discount"
            type="number"
            suffix="₽"
            :min="0"
            :max="props.deal.deferredTransactionAmount()"
            class="w-100"
            @update:model-value="onDiscountChange"
        >
            <q-tooltip>Макс. скидка — сумма товара</q-tooltip>
        </q-input>
        </div>
    </div>

    <!-- Сопроводительное письмо -->
    <div class="row items-center q-pt-md">
        <div class="col-6 col-md-3 text-grey-8">Оформить сопроводительное письмо</div>
            <div class="col-6 col-md-3 text-right">
            <q-checkbox dense v-model="isNeedDocument" color="primary" />
        </div>
    </div>

    <!-- Финальная сумма -->
    <div class="row items-center q-pt-lg q-pb-sm border-top">
        <div class="col-6 col-md-3 text-weight-bold">Финальная сумма продажи</div>
        <div class="col-6 col-md-3 text-weight-bold text-positive text-h6 text-right">
            {{ formatCurrency(finalAmount) }}
        </div>
    </div>

    <div class="row justify-center q-mt-xl">
      <q-btn
            unelevated
            color="primary"
            icon-right="check"
            label="Подтвердить и продолжить"
            @click="successTaxStep"
            size="md"
            style="min-width: 240px;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Deal } from '@/entities/Deal';
import { computed, ref } from 'vue';

const props = defineProps<{
  caption?: string;
  deal: Deal;
}>();

const ndsTax = 22;
const transportTax = 5;
const discount = ref<number>(0);
const isNeedDocument = ref<boolean>(false);

// Вычисляем финальную сумму
const finalAmount = computed(() => {
    const base = props.deal.deferredTransactionAmount()
    const nds = calculateTax(base, ndsTax)
    const transport = calculateTax(base, transportTax)
    return base - discount.value - nds - transport
});

// Вспомогательная функция для расчёта налога
function calculateTax(amount: number, rate: number): number {
    return Math.round(amount * rate / 100)
}

// Форматирование числа в валюту
function formatCurrency(value: number): string {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function onDiscountChange() {
    if (discount.value < 0) discount.value = 0;
}

function successTaxStep() {
    const thisStep = props.deal.getStep('taxLawSelection');
    if (thisStep) {
        thisStep.isSuccess = true;
    }
}
</script>

<style scoped lang="scss">
.w-100 {
    width: 100%;
}

.border-top {
    border-top: 2px solid $grey-4;
}

.text-orange {
    color: $orange-9;
}

.text-negative {
    color: $negative;
}

.text-positive {
    color: $positive;
}
</style>
