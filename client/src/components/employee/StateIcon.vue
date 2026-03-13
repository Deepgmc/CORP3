<template>
    <div v-if="type === 'icon'" class="flex justify-start items-center">
        <div>{{ state.label }}</div>
        <q-icon
            :name="state.icon"
            :size="size"
            class="q-ml-sm"
            :class="[colorClass]"
        />
    </div>

    <q-btn v-else-if="type === 'button'"
        :size="size" :class="[colorClass]"
        :icon="state.icon"
        label=""
        class="q-ml-sm pointer"
        @click="$emit('dispatchAction', transition?.action)"
    />
</template>

<script lang="ts" setup>
import type { TState, TStateTransition } from '@/utils/FiniteStateMachine';
import { computed } from 'vue';

defineEmits(['dispatchAction'])
const props = defineProps<{
    state      : TState,
    size       : string,
    type       : string,
    transition?: TStateTransition
}>()

const colorClass = computed(() => {
    return `text-${props.state.color}`
})
</script>
