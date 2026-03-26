<template>
    <stats-component></stats-component>
    <div>
         <span class="spinner"></span> caption!
    </div>
</template>

<script setup lang="ts">
import StatsComponent from '@/components/StatsComponent.vue';
</script>

<style>
.spinner {
    display: inline-block;
    height: 100px;
    width: 100px;
    border: 7px solid;
    vertical-align: middle;
    border-radius: 50%;
    border-top-color: #06c927;
    animation: rotatee 0.5s linear infinite;
}
@keyframes rotatee {
    0%{ transform: rotate(0deg);}
    100%{ transform: rotate(360deg);}
}
</style>
