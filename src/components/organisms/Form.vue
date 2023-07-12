<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-constant-condition -->
<script setup lang="ts">
  import MoleculeForm from '../molecules/MoleculeForm.vue';
  import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
  import { storage, app, auth } from '@/firebase';
  import { getFirestore, collection, addDoc } from 'firebase/firestore';
  import { signInAnonymously } from "firebase/auth";
  import {ref as refVue} from 'vue'
  import { useForm } from 'vee-validate';

  const db = getFirestore(app);
 
  

  const { values, handleSubmit } = useForm();
  /* const handleFileUpload = () => {
  const file = fileInput.value?.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target?.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (Array.isArray(json)) {
        for (let i = 0; i < json.length; i++) {
          if (Array.isArray(json[i])) {
            const formData: dataFormProps = {
              question: json[i][0],
              typeOfResponse:
                json[i][1] === 'Texto'
                  ? 'text'
                  : json[i][1] === 'Data'
                  ? 'date'
                  : json[i][1] === 'Número inteiro'
                  ? 'number'
                  : json[i][1] === 'Número'
                  ? 'number'
                  : json[i][1] === 'Foto' || json[i][1] === 'Foto/Vídeo'
                  ? 'file'
                  : '',
              params: json[i][2],
              isRequired: json[i][3],
              optionResponse: json[i][4],
              logic: json[i][5],
              photosExamples: json[i][6],
              observation: json[i][7],
            };
            if (formData.question !== '') {
              jsonData.push(formData);
            }
          }
        }
        if (jsonData.length > 0) {
          console.log(jsonData[0]); // Acessando o primeiro elemento do array
        } else {
          console.log('O array jsonData está vazio.');
        }
      } else {
        console.log('jsonData não é um array.');
      }
    };
    reader.readAsArrayBuffer(file);
  }
  }; */

  const onSubmit = handleSubmit(async () => {
    console.log('entrou');
    
    const storedValues = localStorage.getItem('forms');
    const valuesForm = storedValues ? JSON.parse(storedValues) : null;
    const storedValuesFiles = localStorage.getItem('formsFiles');
    const valuesFormFile = storedValuesFiles ? JSON.parse(storedValuesFiles) : null;

    const values = {...valuesForm, ...valuesFormFile}
    
    
    console.log(values);
    
    /* for (const key in updatedValues) {
      const file = updatedValues[key];

      if (Array.isArray(file)) {
        const fileURLs = await Promise.all(file.map((f) => {
          const storageRef = ref(storage, `images/${f.name}`);
          return uploadBytes(storageRef, f)
            .then((snapshot) => getDownloadURL(snapshot.ref)).catch((error) => alert(error)) ;
        }));

        updatedValues[key] = fileURLs;
      } 
    } */

     signInAnonymously(auth).then(async() =>{
      console.log('AUTENTICADO!!!!!!!!!!');
      
      const docRef = await addDoc(collection(db, 'forms'), values);
      console.log('Documento escrito com ID:', docRef.id);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    
    });
  });
  
  const currentSection = refVue('Identificacao')

  const updateSection = (section: any) =>{
    
    
    currentSection.value = section
    console.log('currentSection: '+currentSection.value);
    
  }
  
</script>

<template>
  
  <v-form 
    @submit.prevent="onSubmit"  
    class="form"
  >
  
    <div style="width: 100%;">
      <div>
        <MoleculeForm @section-updated="updateSection"/>
      </div>
    </div>
   <div class="container-btn">
    <v-btn 
      class="btn-submit"
      v-if="
        currentSection === 'Finalizacao'
      "
      type="submit" 
      
      >
      Enviar
    </v-btn>
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

