<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import inputVue from '../atoms/Field.vue';
  import labelVue from '../atoms/Label.vue';
  import { useField } from 'vee-validate'

  type MoleculeFormProps = {
    textLabel: any,
    valueRequiredInput: boolean
    valueTypeInput: string
    textPlaceholder: string,
    nameInput: string
  }

  const props = defineProps<MoleculeFormProps>()
  const { errorMessage } = useField(props.nameInput)
  
 

</script>

<template>
 <div class="container-molecule-form" :class="{'container-molecule-form-error': !!errorMessage}">
    <labelVue :text="props.textLabel" :name-input="props.nameInput"/>
    <inputVue 
      :name-input="props.nameInput"
      :required-input="props.valueRequiredInput" 
      :type-input="props.valueTypeInput" 
      :placeholder-input="props.textPlaceholder"
      
    />
 </div>
</template>

<style>
  .container-molecule-form{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    background-color: #FFF;
    border-radius: 8px;
    border: 1px solid #f1f0f0;
  }

  .container-molecule-form-error{
    border: 1px solid rgb(217,48,37);
  }
</style>