<template>
    <h3>Всякая статистика</h3>
    <div>
         <span class="spinner"></span> caption!
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.spinner {
    display: inline-block;
    height: 50px;
    width: 50px;
    border: 5px solid;
    vertical-align: middle;
    border-radius: 50%;
    border-top-color: $info;
    animation: rotatee 0.7s linear infinite;
}
@keyframes rotatee {
    0%{ transform: rotate(0deg);}
    100%{ transform: rotate(360deg);}
}
</style>
