<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import { useField } from 'vee-validate'
    

  type PropsInput ={
    typeInput: string,
    placeholderInput: string
    requiredInput: boolean,
    nameInput: string

  }
  

  const props = defineProps<PropsInput>()
  const { value, setValue } = useField(props.nameInput)
</script>

<template>
  <v-text-field
    :name="props.nameInput"
    v-model="value" 
    :type="props.typeInput" 
    :placeholder="props.placeholderInput" 
    :required="props.requiredInput"
    multiple  
    @change="setValue($event.target.value)"
    style="height: 4rem;"
    :prefix="props.nameInput === 'valueNFReferentSecontInstallment' || props.nameInput === 'valueNFReferentExtraCosts' ? 'R$' :'' "
    
  />
 
</template>

<style>

.v-field--variant-filled .v-field__overlay {
  background-color: none;
}
</style>