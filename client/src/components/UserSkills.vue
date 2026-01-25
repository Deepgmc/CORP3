<template>
    <div v-for="prop in props.skills" :key="prop.id">
        {{ prop.skill }}
    </div>
</template>

<script setup lang="ts">
import type { TSkills } from '@/interfaces/User';

const props = defineProps<{
  skills: TSkills[]
}>()

</script>
