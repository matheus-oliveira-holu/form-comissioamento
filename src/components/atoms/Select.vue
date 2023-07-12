<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import {useField } from 'vee-validate'

  type PropsSelect ={
    requiredInput: boolean,
    nameSelect: string
    items?: string[]
  }

  const props = defineProps<PropsSelect>()
  const { value, setValue } = useField<any>(props.nameSelect)
</script>

<template>

  <v-select

    placeholder="Insira sua resposta"
    :name-select="props.nameSelect" 
    :required-input="props.requiredInput"
    :items="props.items"
    v-model="value"
    @change="setValue($event.target.value)"
  >
  </v-select>

</template>

<style>
  .select-custom{
    width: 100%;
    display: flex;
    padding: 15px 16px;
  }

</style>