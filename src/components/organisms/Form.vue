<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-constant-condition -->
<script setup lang="ts">
  import MoleculeForm from '../molecules/MoleculeForm.vue';
  import {ref as refVue} from 'vue'
  import { useForm } from 'vee-validate';
  import { db, auth } from '@/firebase';
  import { addDoc, collection } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
 
  const { handleSubmit } = useForm();
   
  function flattenArray(arr: any[]): any[] {
    const flattenedArray: any[] = [];
    arr.forEach((item: any) => {
      if (Array.isArray(item)) {
        flattenedArray.push(...flattenArray(item));
      } else {
        flattenedArray.push(item);
      }
    });
    return flattenedArray;
  }

  function arrayToNestedString(arr: any[]): string {
    if (!Array.isArray(arr)) {
      return `"${String(arr)}"`;
    }

    const innerStrings: any[] = arr.map((innerArr) => `[${innerArr.map(String).join(',')}]`);
    return `[${innerStrings.join(',')}]`;
  }


  const onSubmit = handleSubmit(async () => {

    const storedValues = localStorage.getItem('forms');
    const valuesForm = storedValues ? JSON.parse(storedValues) : null;
    const storedValuesFiles = localStorage.getItem('formsFiles');
    const valuesFormFile = storedValuesFiles ? JSON.parse(storedValuesFiles) : null;

    const values = { ...valuesForm, ...valuesFormFile };

  
    for (const key in values) {
      if (Array.isArray(values[key])) {
        values[key] = flattenArray(values[key]);
      }
    }

    for(let i = 0; i < values.quantityInvertersInstalled; i++){
      values.photoChainInverterInput[i].inverter.distMppt = arrayToNestedString(values.photoChainInverterInput[0].inverter.distMppt)
      values.photoVoltInverterInput[i].inverter.distMppt = arrayToNestedString(values.photoVoltInverterInput[0].inverter.distMppt)
      values.qtdPanelsConnectedSingleInputOfTheSingle[i].inverter.distMppt = arrayToNestedString(values.qtdPanelsConnectedSingleInputOfTheSingle[i].inverter.distMppt)
    }

    values.dataInclude = new Date().toLocaleString()

    signInAnonymously(auth).then(async() =>{

      await addDoc(collection(db, 'forms'), values);
      alert('Formulário enviado com sucesso!');
      localStorage.clear();
      window.location.reload();
    })
    .catch((error) => {
      const errorMessage = error.message;
    
      alert('Erro ao salvar o formulário!, descrição do problema: '+errorMessage)
      console.log(error);
    });
  });



  
  const currentSection = refVue('Identificacao')

  const updateSection = (section: any) =>{
    currentSection.value = section
  }
  
</script>

<template>
  
  <v-form 
    @submit.prevent="onSubmit"  
    class="form"
  >
  
    <div style="width: 100%;">
      <div>
        <MoleculeForm @section-updated="updateSection" @send-form="onSubmit"/>
      </div>
    </div>
  </v-form>
</template>

<style>

.form{
  width: 80%;
  margin: 0 auto;
  margin-top: 8rem;
  margin-bottom: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0;
}
.container-btn{
  width: 30%;
  margin-top: -4.3rem;
  margin-right: -70%;
}
.btn-submit{
  padding: 1rem 2rem !important;
  display: flex !important;
  align-items: center !important; 
  margin: 0 auto !important;
}

@media screen and (min-width:1120px) {
  .form{
    width: 50%;
  }
}

@media screen and (max-width:720px) {
  .form{
    width: 100%;
  }
}
 
</style>

