<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-constant-condition -->
<script setup lang="ts">
  import MoleculeForm from '../molecules/MoleculeForm.vue';
  import Button from '../atoms/Button.vue';

  import { reactive, onMounted} from 'vue'

  import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
  import { storage, app, auth } from '@/firebase';
  import { getFirestore, collection, addDoc } from 'firebase/firestore';
  import { signInAnonymously } from "firebase/auth";

  import { useForm } from 'vee-validate';
  import * as yup from 'yup';

  import axios from 'axios';

  import XLSX from 'xlsx'

  type dataFormProps = {
    question: string,
    typeOfResponse: string,
    params: string,
    isRequired: string,
    optionResponse: string,
    logic: string,
    photosExamples: string,
    observation: string,
  }
  
  const jsonData: dataFormProps[] = reactive([])
  const db = getFirestore(app);

  const schema = yup.object({
    companyName: yup.string().required("Esta pergunta é obrigatória*"),
    technicalManager: yup.string().required("Esta pergunta é obrigatória*"),
    idProject: yup.number().required("Esta pergunta é obrigatória*"),
    customerName: yup.string().required("Esta pergunta é obrigatória*"),
    startDate: yup.date().required("Esta pergunta é obrigatória*"),
    finalDate: yup.date().required("Esta pergunta é obrigatória*"),
    structurePhotoBeforeInstallation: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoOfGroundingModules: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoAllPanelsInstalled:yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
  });
  
  const { values, handleSubmit } = useForm({
    validationSchema: schema,
  });

  

  const handleFileUpload = () => {
    const fileUrl = 'https://docs.google.com/spreadsheets/d/1mHvSf2Jho14pMen1-Q_AxeobSc0PgQVIU3I2GIO0THw/edit?usp=sharing';

    axios.get(fileUrl, { responseType: 'arraybuffer' })
      .then(response => {
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (Array.isArray(json)) {
          for (var i = 0; i < json.length; i++) {
            if (Array.isArray(json[i])){
              
              const data: dataFormProps = {
                question: json[i][0] as string,
                typeOfResponse: 
                  json[i][1] === 'Texto' ? 'text' 
                  : json[i][1] === 'Data' ? 'date' 
                  : json[i][1] === 'Número inteiro'  ? 'number' 
                  : json[i][1] === 'Número'  ? 'number' 
                  : json[i][1] === 'Foto'  ? 'file' 
                  : json[i][1] === 'Foto/Vídeo'  ? 'file' : '',
                params: json[i][2] as string,
                isRequired: json[i][3] as string,
                optionResponse: json[i][4] as string,
                logic: json[i][5] as string,
                photosExamples: json[i][6] as string,
                observation: json[i][7] as string,
              };
              if (data.question !== '') {
                jsonData.push(data);
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
      })
      .catch(error => {
        console.log('Erro ao carregar o arquivo:', error);
      });
  };

  
  const onSubmit = handleSubmit(async () => {
    const updatedValues = { ...values }; // Cópia values

    for (const key in values) {
      const file = values[key];

      if (Array.isArray(file)) {
        const fileURLs = await Promise.all(file.map((f) => {
          const storageRef = ref(storage, `images/${f.name}`);
          return uploadBytes(storageRef, f)
            .then((snapshot) => getDownloadURL(snapshot.ref));
        }));

        updatedValues[key] = fileURLs;
      }
    }

    signInAnonymously(auth).then(async() =>{
      console.log('AUTENTICADO!!!!!!!!!!');
      
      const docRef = await addDoc(collection(db, 'forms'), updatedValues);
      console.log('Documento escrito com ID:', docRef.id);
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    
    });
  });

  onMounted(() => {
    handleFileUpload(); // Executa a função assim que o componente é montado
  });
</script>

<template>
  <div>
    <input type="file" ref="fileInput" @change="handleFileUpload">
  </div>

  <form @submit.prevent="onSubmit">
    <div class="form-box">
      <div 
        class="container-form"
        v-for="(data, index) in jsonData"
        :key="index"
      >
        <MoleculeForm
          v-if="data.question !== undefined && index !== 0 && data.typeOfResponse  "
          :text-label="data.question"
          text-placeholder="Sua resposta"
          :value-type-input="data.typeOfResponse"
          :value-required-input="true"
          :name-input="data.question"
        />
      </div>
    </div>
    <Button title="Enviar" type="submit" />
  </form>
</template>

<style>
  form {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-box {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .container-form {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: left;
    text-align: left;
    gap: 2rem;
  }
</style>

