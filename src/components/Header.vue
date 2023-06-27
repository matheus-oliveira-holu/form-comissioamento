<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { reactive, watch } from 'vue';

const state = reactive({
    currentNumber: 1,
    currentNumberMultForTwo: 1,
})

function count(){
    state.currentNumber++;
}
watch(() => state.currentNumber,(newValue: number, oldValue: number) => {
    console.log("Old "+oldValue);
    console.log("New "+newValue);
    
})

</script>

<template>
    <div>
        <p>contagem: {{ state.currentNumber }}</p>
        <p>Multiplicado por 2:  {{ state.currentNumberMultForTwo }}</p>
        <button @click="count">Acrescentar</button>
    </div>
</template>

<style></style>