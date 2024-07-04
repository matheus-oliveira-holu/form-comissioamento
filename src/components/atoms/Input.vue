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
    v-if="props.nameInput === 'CNPJ'"
    v-mask="'##.###.###/####-##'"
    @change="setValue($event.target.value)"
    style="height: 4rem;"
  />
  <v-text-field
    :name="props.nameInput"
    v-model="value"
    :type="'text'"
    :placeholder="props.placeholderInput"
    :required="props.requiredInput"
    multiple
    v-else-if="props.nameInput === 'valueNFReferentSecontInstallment' || props.nameInput === 'valueNFReferentExtraCosts'"
    v-mask="['R$ ##,##', 'R$ ###,###', 'R$ #.###,##', 'R$ ##.###,##', 'R$ ###.###,##']"
    @change="setValue($event.target.value)"
    style="height: 4rem;"
  />
  <v-text-field
    :name="props.nameInput"
    v-model="value"
    :type="props.typeInput"
    :placeholder="props.placeholderInput"
    :required="props.requiredInput"
    multiple
    v-else-if="props.typeInput === 'date'"
    :max="new Date().toISOString().substr(0, 10)"
    @change="setValue($event.target.value)"
    style="height: 4rem;"
  />
  <v-text-field
    :name="props.nameInput"
    v-model="value"
    :type="props.typeInput"
    :placeholder="props.placeholderInput"
    :required="props.requiredInput"
    :min="props.typeInput === 'number' && 0"
    multiple
    v-else
    @change="setValue($event.target.value)"
    style="height: 4rem;"
  />
</template>


<style>

.v-field--variant-filled .v-field__overlay {
  background-color: none;
}
</style>