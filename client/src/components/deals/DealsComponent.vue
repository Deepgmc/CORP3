<template>
    <h4>Сделки</h4>
    <div v-for="deal in deals" :key="deal.dealId">
        {{ deal.dealId }} - {{ deal.ownerId }} - {{ deal.partnerId }} discount: {{ deal.discount }}
    </div>
</template>
<script setup lang="ts">
import { Rbac } from '@/entities/Rbac';
const $um = Rbac.getInstance()

const deals = $um.company.deals;

</script>
