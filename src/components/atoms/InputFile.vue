<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
  import { storage } from '@/firebase';
  import { ref as refVue, reactive, onMounted } from 'vue';
  import { useField } from 'vee-validate';


  type PropsInputFile = {
    placeholderInput: string;
    requiredInput: boolean;
    nameInput: string;
  };

  const props = defineProps<PropsInputFile>();
  const {  setValue } = useField(props.nameInput);
  let updatedValues: any = reactive({});
  let uploadNames: any = reactive({});

  const selectedFiles = refVue<File[]>([]);
  const selectedFileNames = refVue<string[]>([]);

  const openFileInput = () => {
    const fileInput = document.querySelector(`input[name="${props.nameInput}"]`) as HTMLInputElement;
    if (fileInput) {
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
        updatedValues[props.nameInput] = [];
        
        for (const file of files) {
          const storageRef = ref(storage, `images/${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const fileURL = await getDownloadURL(snapshot.ref);

          
        

          updatedValues[props.nameInput].push(fileURL);
          setValue( updatedValues[props.nameInput])
        }

        updatedValues = await { ...storedValues, ...updatedValues }; // Merge existing values with new values

        localStorage.setItem('formsFiles', JSON.stringify(updatedValues));
      }

      
      uploadNames[props.nameInput] = []
      
      for (const file of files) {
        uploadNames[props.nameInput].push(file.name)
      }

      uploadNames = await {...uploadNamesValues, ...uploadNames}

      localStorage.setItem('uploadNames', JSON.stringify(uploadNames));
    
    }
  };


  onMounted(async () => {
    const storedValues = await JSON.parse(localStorage.getItem('uploadNames')  || '{}')
    if (storedValues) {
      uploadNames[props.nameInput] = storedValues[props.nameInput]
    }
  });

</script>



<template>
  <div class="containerV">
    <div v-for="file in  uploadNames[props.nameInput]" :key="file.name">
      <span>{{ file }}</span>
    </div>
    <v-btn class="v-btn-custom"  color="#F3F3F3" @click="openFileInput">
      <v-icon left>mdi-upload</v-icon>
      Selecionar
    </v-btn>
    <input 
      ref="fileInput" 
      type="file" 
      style="display: none" 
      @change="handleFileInputChange" 
      :name="props.nameInput"
      :required="props.requiredInput"
      multiple
      max="10"
      accept="image/*"
    />
  </div>
</template>

<style>
  .containerV{
    width: 100%;
    margin: 0;
    display: flex;
    justify-content: left;
    flex-direction: column;
    margin-top:0.5rem;
    gap:1rem;
  }
  .v-btn-custom{
    width: 12.25rem;
    display: flex;
    padding: 0.5rem 1.5rem;
    align-items: center;
    border-bottom: 1px solid var(--gray-400, #CCC);
  }
</style>
