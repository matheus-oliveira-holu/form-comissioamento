<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
  import { storage } from '@/firebase';
  import { ref as refVue, reactive, onMounted, nextTick } from 'vue';
  import { useField } from 'vee-validate';



  type PropsInputFile = {
    placeholderInput: string;
    requiredInput: boolean;
    nameInput: string;
    idProject:string
    inverter?: number;
    mppt?: number;
    lenghtMppt?:number;
    quantityInverter?:number;
    input?:number;
    quantityInput?:number
  };

  const props = defineProps<PropsInputFile>();
  const {  setValue } = useField(props.nameInput);
  let updatedValues: any = reactive({
    photoVoltInverterInput: [],
    photoChainInverterInput:[]
  });
  let uploadNames: any = reactive({});

  const selectedFiles = refVue<File[]>([]);
  const selectedFileNames = refVue<string[]>([]);

  const openFileInput = () => {
    
    const fileInput = document.querySelector(`input[name="${props.nameInput}"]`) as HTMLInputElement;
    if (fileInput) {
      if(props.nameInput.startsWith("photoVoltInverterInput") || props.nameInput.startsWith("photoChainInverterInput")){
        fileInput.removeAttribute('multiple');
      }
      fileInput.click();
      
    }
  };

  const handleFileInputChange = async (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    const storedValues = JSON.parse(localStorage.getItem('formsFiles') || '{}');
    const uploadNamesValues = JSON.parse(localStorage.getItem('uploadNames') || '{}');

    if (inputElement && inputElement.files) {
      const files = Array.from(inputElement.files);
      selectedFiles.value = files;
      selectedFileNames.value = files.map(file => file.name);


      if (files.length > 0) {
        updatedValues = { ...storedValues };

        if (!updatedValues[props.nameInput]) {
          updatedValues[props.nameInput] = [];
        }

        if (!uploadNames[props.nameInput]) {
          uploadNames[props.nameInput] = [];
        }
        
        if( props.nameInput.startsWith("photoVoltInverterInput") && props.quantityInverter !== undefined && props.lenghtMppt !== undefined && props.quantityInput !== undefined &&props.mppt !== undefined && props.inverter !== undefined) {

          // Verifique se o array "photoVoltInverterInput" já foi criado anteriormente
          if (!updatedValues.photoVoltInverterInput) {
            updatedValues.photoVoltInverterInput = [];

            for (let i = 0; i < props.quantityInverter; i++) {
              updatedValues.photoVoltInverterInput.push({
                inverter:{
                  distMppt: Array.from({ length: props.lenghtMppt },() => [])
                }
              })
              
            }
            
          }
        }

        if( props.nameInput.startsWith('photoChainInverterInput') && props.quantityInverter !== undefined && props.lenghtMppt !== undefined && props.inverter !== undefined) {

          // Verifique se o array "photoChainInverterInput" já foi criado anteriormente
          if (!updatedValues.photoChainInverterInput) {
            updatedValues.photoChainInverterInput = [];

            for (let i = 0; i < props.quantityInverter; i++) {
              updatedValues.photoChainInverterInput.push({
                inverter:{
                  distMppt: Array.from({ length: props.lenghtMppt },() => [])
                }
              })
            }
          }
        }
 

        for (const file of files) {
          const storageRef = ref(storage, `images/${props.idProject}/${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const fileURL = await getDownloadURL(snapshot.ref);
        

          if (props.nameInput.startsWith("photoVoltInverterInput")  && props.inverter !== undefined && props.mppt !== undefined && props.input !== undefined && props.quantityInput !== undefined) {
            
            if(!updatedValues.photoVoltInverterInput[props.inverter].inverter.distMppt[props.mppt]){

              updatedValues.photoVoltInverterInput[props.inverter].inverter.distMppt[props.mppt] = Array.from({ length: props.quantityInput }, () => []);
            }
            
            // Push the fileURL into the nested array
            updatedValues.photoVoltInverterInput[props.inverter].inverter.distMppt[props.mppt][props.input] = fileURL;
          }


          if (props.nameInput.startsWith("photoChainInverterInput") && props.inverter !== undefined && props.mppt !== undefined && props.input !== undefined && props.quantityInput !== undefined) {
            if(!updatedValues.photoChainInverterInput[props.inverter].inverter.distMppt[props.mppt]){
              updatedValues.photoChainInverterInput[props.inverter].inverter.distMppt[props.mppt] = Array.from({ length: props.quantityInput }, () => []);
            }

            // Push the fileURL into the nested array
            updatedValues.photoChainInverterInput[props.inverter].inverter.distMppt[props.mppt][props.input] = fileURL;
          }

          if(!props.nameInput.startsWith("photoVoltInverterInput") && !props.nameInput.startsWith("photoChainInverterInput")){
            updatedValues[props.nameInput].push(fileURL);
          }
          
          uploadNames[props.nameInput].push(file.name);
        }

        localStorage.setItem('formsFiles', JSON.stringify(updatedValues));
        uploadNames = await {...uploadNamesValues, ...uploadNames}
        localStorage.setItem('uploadNames', JSON.stringify(uploadNames));

        setValue(updatedValues[props.nameInput]);
      }
    }
  };

  const deleteImage = async () =>{
    if(props.nameInput.startsWith('photoChainInverterInput') && props.inverter !== undefined && props.mppt !== undefined && props.input !== undefined){
      
      deleteImageFromStorage(uploadNames[props.nameInput]);
      const formsFiles = JSON.parse(localStorage.getItem("formsFiles") || "{}");
      let names = JSON.parse(localStorage.getItem('uploadNames') || '{}');
      
      delete names[props.nameInput];
      delete formsFiles.photoChainInverterInput[props.inverter].inverter.distMppt[props.mppt][props.input];
      formsFiles.photoChainInverterInput[props.inverter].inverter.distMppt[props.mppt][props.input] = []

      uploadNames = {...names}

      localStorage.setItem("uploadNames", JSON.stringify(names));
      localStorage.setItem("formsFiles", JSON.stringify(formsFiles));
    
      await nextTick();
    }else if(props.nameInput.startsWith('photoVoltInverterInput') && props.inverter !== undefined && props.mppt !== undefined && props.input !== undefined){
      deleteImageFromStorage(uploadNames[props.nameInput]);
      const formsFiles = JSON.parse(localStorage.getItem("formsFiles") || "{}");
      let names = JSON.parse(localStorage.getItem('uploadNames') || '{}');
      
      delete names[props.nameInput];
      delete formsFiles.photoVoltInverterInput[props.inverter].inverter.distMppt[props.mppt][props.input];
      formsFiles.photoVoltInverterInput[props.inverter].inverter.distMppt[props.mppt][props.input] = []

      uploadNames = {...names}

      localStorage.setItem("uploadNames", JSON.stringify(names));
      localStorage.setItem("formsFiles", JSON.stringify(formsFiles));
    
      await nextTick();

    }else{

      deleteImageFromStorage(uploadNames[props.nameInput])
      const formsFiles = JSON.parse(localStorage.getItem('formsFiles') || '{}');
      let names = JSON.parse(localStorage.getItem('uploadNames') || '{}');
      
      delete names[props.nameInput];
      delete formsFiles[props.nameInput];
      
      uploadNames = {...names}

      localStorage.setItem('uploadNames', JSON.stringify(names));
      localStorage.setItem('formsFiles', JSON.stringify(formsFiles));
    
      await nextTick();
    }
  
  }

  const deleteImageFromStorage = async (filename: string[] | Record<number, string>) => {
    
    for (const file of Object.values(filename)) {
      const storageRef = ref(storage, `images/${props.idProject}/${file}`);
      
      try {
        await deleteObject(storageRef);
        /* console.log('Imagem excluída com sucesso do Firebase Storage.'); */
      } catch (error) {
        console.error('Erro ao excluir imagem do Firebase Storage:', error);
      }
    }
  };


  onMounted(() => {
    const storedValues =  JSON.parse(localStorage.getItem('uploadNames')  || '{}')
    if (storedValues) {
      uploadNames[props.nameInput] = storedValues[props.nameInput]
    }
  });

</script>



<template>
  <div class="containerV">
    <div  class="names">
      <div v-for="file in  uploadNames[props.nameInput]" :key="file">
      <span>{{ file }}</span>
    </div>
    </div>
      <div class="container-btn-file">
        <v-btn class="v-btn-custom"  color="#F3F3F3" @click="openFileInput">
          <v-icon left>mdi-upload</v-icon>
          Selecionar
        </v-btn>
        <v-btn v-if="uploadNames[props.nameInput]" class="v-btn-delete"  color="rgb(217,48,37)" @click="deleteImage">
          <v-icon left color="#FFF">mdi-delete</v-icon>
          <span style="color: #FFF;">Limpar</span>
        </v-btn>
      </div>
    <input 
      ref="fileInput" 
      type="file" 
      style="display: none" 
      @change="handleFileInputChange" 
      :name="props.nameInput"
      :required="props.requiredInput"
      :inverter="props.inverter"
      :mppt="props.mppt"
      multiple
      max="10"
      accept="image/*,.pdf"
    />
  </div>
</template>

<style>
  .containerV{
    width: 100%;
    height: auto;
    margin: 0;
    display: flex;
    justify-content: left;
    flex-direction: column;
    justify-content: center;
    margin-top:1rem;
    gap:1rem;
  }

  .container-btn-file{
    position: relative;
    display: flex;
    gap: 1rem ;
    
  }
  .v-btn-custom{
    width: 12.25rem;
    display: flex;
    padding: 0.5rem 1.5rem;
    align-items: center;
    border-bottom: 1px solid var(--gray-400, #CCC);
  }
  .v-btn-delete{
    width: 10rem;
    display: flex;
    padding: 0.5rem 1.5rem;
    align-items: center;
    border-bottom: 1px solid var(--gray-400, #f75a5a);
  }

  .names{
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  @media screen and (max-width: 480px) {
    .v-btn-custom{
      width: 10rem;
   
    }
  }
</style>
