<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
  import * as yup from 'yup';
  import inputVue from '../atoms/Input.vue';
  import labelVue from '../atoms/Label.vue';
  import  SelectVue from '../atoms/Select.vue';
  import {ref as refVue, computed, watch, reactive, onMounted} from 'vue'
  import InputFile from '../atoms/InputFile.vue';
  import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
  import { storage, app, auth } from '@/firebase';

  
  type dataFormProps = {
    id?: number,
    name: string,
    question: string,
    typeOfResponse: string,
    isRequired: boolean,
    section: 
      'Identificacao' | 'Foto Geral' | 'Micro e String' | 
      'String' | 'Entradas MPPT' | 'Micro' | 'Conexoes' | 
      'Seguranca' | 'Monitoramento' | 'Nota Fiscal' | 'Pagamento' | 'Finalizacao',
    photosExamples?: string,
  }

  type inverterProps = {
    name: string,
    MPPT:{
      name: string,
      numberOfInputs: number
    }[]
  }

  const emit = defineEmits(['section-updated'])

  
  const dataArray: dataFormProps[] = [
    /* Indentificação */
    { id:1, name: 'enterpriseName', question: 'Qual o nome da sua empresa?', typeOfResponse: 'text', isRequired: true, section: 'Identificacao'},
    { id:2, name: 'responsibleTech', question: 'Qual o nome do responsável técnico?', typeOfResponse: 'text', isRequired: true, section: 'Identificacao'},
    { id:3, name: 'projectId', question: 'Código ID do projeto', typeOfResponse: 'number', isRequired: true, section: 'Identificacao'},
    { id:4, name: 'customerName', question: 'Nome do cliente?', typeOfResponse: 'text', isRequired: true, section: 'Identificacao'},
    { id:5, name: 'installationStartDate', question: 'Data de início da instalação', typeOfResponse: 'date', isRequired: true, section: 'Identificacao'},
    { id:6, name: 'installationFinalDate', question: 'Data de término da instalação', typeOfResponse: 'date', isRequired: true, section: 'Identificacao'},
    /* Foto Geral */
    { id:7,  name: 'photoFixingStructure', question: 'Foto da estrutura de fixação antes da instalação dos painéis', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:8,  name: 'photoGroundingModules', question: 'Foto do aterramento dos módulos', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:9,  name: 'photoInstalledPanels', question: 'Foto geral de todos os painéis instalados', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:10,  name: 'photoConnectionsEletric', question: 'Foto detalhada das conexões elétricas da(s) caixa(s) de proteção CA', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:11, name: 'photoInverterConnectionPoint', question: 'Foto do ponto de conexão do inversor com a rede', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:12, name: 'photoFaceGroundingInverter', question: 'Foto do aterramento da carcaça do inversor', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:13, name: 'photoGroundingAttachmentPoint', question: 'Foto do ponto de fixação do aterramento do sistema', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:14, name: 'photoForVisualInspection', question: 'Fotos para inspeção visual do telhado após a obra (condições das telhas, calhas e limpeza do local)', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:15, name: 'photoCAPhaseAndNeutral', question: 'Fotos da tensão(s) CA medida(s) entre fase e neutro', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:16, name: 'photoCAPhaseAndPhase', question: 'Foto da(s) tensão(ões) CA medida(s) entre fase e fase', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:17, name: 'photoTagModules', question: 'Foto da etiqueta de um dos módulos', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:18, name: 'photoIfProjectsWithBlocker', question: 'Em caso de projetos com bloqueador (desligamento remoto), envie uma foto', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:19, name: 'photoSNIfProjectsWithBlocker', question: 'Em caso de projetos com bloqueador (desligamento remoto), envie uma foto do SN (ID)', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:20, name: 'photoInputPattern', question: 'Foto do padrão de entrada completo com placa(s) de sinalização', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    { id:21, name: 'photoCircuitBreaker', question: 'Foto do disjuntor do padrão de entrada adequado e DPS instalado', typeOfResponse: 'file', isRequired: true, section: 'Foto Geral'},
    /* ponto de descisão */
    {id:22, name: 'inverterTypeInstalled', question: 'Qual tipo de inversor instalado?', typeOfResponse: 'lista', isRequired: true, section: 'Micro e String'},
    /* string  */
    {id:23, name: 'quantityInvertersInstalled', question: 'Quantos inversores foram instalados?', typeOfResponse: 'number', isRequired: true, section:'String'},
    {id:24, name: 'photoSNInverterString', question: 'Foto SN do inversor', typeOfResponse: 'file', isRequired: true, section:'String'},
    {id:25, name: 'photoSNAntennaInverterString', question: 'Foto SN da antena do inversor', typeOfResponse: 'file', isRequired: true, section:'String'},
    {id:26, name: 'photoDetailedConnectionEletric', question: 'Foto detalhada das conexões elétricas da(s) stringbox CC', typeOfResponse: 'file', isRequired: true,  section:'String'},
    {id:27, name: 'photoInstallationOfInvertersCCAndCA', question: 'Foto ampla do local de instalação do(s) inversor(es), stringbox CC e caixa(s) de proteção CA', typeOfResponse: 'file', isRequired: true,  section:'String'},
    {id:28, name: 'locationInverterInstalled', question: 'Qual o local em que o inversor foi instalado?', typeOfResponse: 'text', isRequired: true,  section:'String'},
    {id:29, name: 'heightBetweenInverterDisplayAndFloor', question: 'Qual a altura entre o visor do inversor e piso acabado?', typeOfResponse: 'number', isRequired: true, section:'String'},
    /*  string - lógica MPPT */
    {id:30, name: 'inverterStringUsed', question: 'Qual o "n" inversor string utilizado?', typeOfResponse: 'lista', isRequired: true,  section:'Entradas MPPT'},
    {id:31, name: 'qtdPanelsConnectedSingleInputOfTheSingle', question: 'Quantos painéis foram conectados a entrada única do único MPPT deste inversor?', typeOfResponse: 'number', isRequired: true,  section:'Entradas MPPT' },
    {id:32, name: 'photoVoltInverterInput', question: 'Envie uma foto da tensão dessa entrada do inversor', typeOfResponse: 'file', isRequired: true,  section:'Entradas MPPT'},
    {id:33, name: 'photoChainInverterInput', question: 'Envie uma foto da corrente dessa entrada do inversor', typeOfResponse: 'file', isRequired: true,  section:'Entradas MPPT'  },

    /* micro */
    {id: 34, name: 'microInverterInstalled', question: 'Qual micro inversor foi instalado?', typeOfResponse: 'lista', isRequired: true, section: 'Micro'},
    {id:35, name: 'quantityMicroInvertersInstalled', question: 'Quantos micros foram instalados?', typeOfResponse: 'number', isRequired: true, section:'Micro'},
    {id:36, name: 'howManyInvertersNotCompletelyFull', question: 'Quantos desses micros NÃO estão completamente cheios?', typeOfResponse: 'number', isRequired: true, section:'Micro'},
    {id:37, name: 'sketchModulesOnTheRoof', question: 'Envie o croqui dos módulos no telhado separados por micro inversor.', typeOfResponse: 'file', isRequired: true, section:'Micro'},
    {id:38, name: 'photoSNOfAllMicroInverters', question: 'Foto SN de TODOS os micro inversores', typeOfResponse: 'file', isRequired: true, section:'Micro' },
    {id:39, name: 'photoSNOfAntennaMicroInverters', question: 'Foto SN da antena dos micros inversores', typeOfResponse: 'file', isRequired: true,section:'Micro'},
    
    /* conexão */
    {id:40, name: 'thePanelsGroundedTogether', question: 'Os painéis foram aterrados entre si e conectados ao aterramento conforme a Normativa?', typeOfResponse: 'lista', isRequired: true, section: 'Conexoes'},
    {id:41, name: 'allRightCrimpagesConnectorsMC4', question: 'As crimpagens dos conectores MC4 foram realizadas com o alicate correto e suas conexões foram devidamente conferidas?', typeOfResponse: 'lista', isRequired: true, section: 'Conexoes'},
    {id:42, name: 'doubleIsulationCablesWereUsed', question: 'Foram utilizados cabos de dupla isolação (solar), enviados no kit, para realizar as ligações das partes de corrente contínua (CC) do sistema?', typeOfResponse: 'lista', isRequired: true, section: 'Conexoes'},
    {id:43, name: 'typeOfPipingUsedAtInstall', question: 'Qual tipo de tubulação utilizado na instalação elétrica do sistema?', typeOfResponse: 'lista', isRequired: true, section: 'Conexoes'},
    {id:44, name: 'stringBInvertersAndQBInstallInCoveredPlace', question: 'As Stringbox, inversores e o quadro de distribuição foram instaladas em local coberto, livre de intempéries como incidência de sol e chuva?', typeOfResponse: 'lista', isRequired: true, section: 'Conexoes'},
    {id:45, name: 'whyNotStringBInvertersAndQBInstallInCoveredPlace', question: 'Por qual motivo não?', typeOfResponse: 'text', isRequired: true, section: 'Conexoes'},
    {id:46, name: 'installAccordingSinglelineDiagram', question: 'A instalação foi executada conforme diagrama unifilar elaborado?', typeOfResponse: 'lista', isRequired: true, section: 'Conexoes'},
    {id:47, name: 'whyNotInstallAccordingSinglelineDiagram', question: 'Por qual motivo não?', typeOfResponse: 'text', isRequired: true, section: 'Conexoes'},
    {id:48, name: 'singlelineProjectDiagram', question: 'Envie o diagrama unifilar do projeto.', typeOfResponse: 'file', isRequired: true, section: 'Conexoes'},
    {id:49, name: 'respectedMinimunSoacingInverters', question: 'Foi respeitado o espaçamento livre mínimo dos inversores, conforme orientado no Manual de Instalação?', typeOfResponse: 'lista', isRequired: true, section: 'Conexoes'},
    {id:50, name: 'whyNotRespectedMinimunSoacingInverters', question: 'Por qual motivo não?', typeOfResponse: 'text', isRequired: true, section: 'Conexoes'},
    {id:51, name: 'allStringChecked', question: 'No ensaio de polaridade, todas as strings foram verificadas?', typeOfResponse: 'lista', isRequired: true, section: 'Conexoes'},
    {id:52, name: 'whyNotAllStringChecked', question: 'Por qual motivo não?', typeOfResponse: 'text', isRequired: true, section: 'Conexoes'},
    {id:53, name: 'heldInspectionLocationAfterInstall', question: 'Foi realizada inspeção no local após a instalação?', typeOfResponse: 'lista', isRequired: true, section: 'Conexoes'},
    /* Segurança */
    {id:54, name: 'allEPIsAndEPCsWereUsed', question: 'Foram utilizados todos os EPIs e EPCs necessários durante a instalação?', typeOfResponse: 'lista', isRequired: true, section: 'Seguranca'},
    {id:55, name: 'photoUseEPIsAndEPCsNecessary', question: 'Envie uma foto ou vídeo demonstrando a utilização de EPIs e EPCs necessários durante a instalação', typeOfResponse: 'file', isRequired: true, section: 'Seguranca'},
    /* Monitoramento */
    {id:56, name: 'monitoringConnectedToHOLUAccount', question: 'O monitoramento foi realizado e está conectado a conta da Holu?', typeOfResponse: 'lista', isRequired: true, section: 'Monitoramento'},
    {id:57, name: 'whyNotMonitoringConnectedToHOLUAccount', question: 'Por qual motivo não?', typeOfResponse: 'text', isRequired: true, section: 'Monitoramento'},
    {id:58, name: 'monitoringLogin', question: 'Qual login do monitoramento do cliente?', typeOfResponse: 'text', isRequired: true, section: 'Monitoramento'},
    {id:59, name: 'monitoringPassword', question: 'Qual senha do monitoramento do cliente?', typeOfResponse: 'text', isRequired: true, section: 'Monitoramento'},
    {id:60, name: 'photoAppmonitoringCustomer', question: 'Foto do aplicativo de monitoramento do cliente', typeOfResponse: 'file', isRequired: true, section: 'Monitoramento'},
    /* Nota Fiscal */
    {id:61, name: "sendNFsForPaymentNow", question: "Deseja enviar suas NF's para pagamento agora?", typeOfResponse: 'lista', isRequired: true, section: 'Nota Fiscal'},
    {id:62, name: "uploadNFInPDFReferentSecondInstallment", question: "Faça upload da nota fiscal em PDF referente a segunda parcela do pagamento acordado", typeOfResponse: 'file', isRequired: true, section: 'Nota Fiscal'},
    {id:63, name: "valueNFReferentSecontInstallment", question: "Informe o valor da nota fiscal referente a segunda parcela do pagamento acordado", typeOfResponse: 'number', isRequired: true, section: 'Nota Fiscal'},
    {id:64, name: "uploadNFReferentExtraCosts", question: "Caso exista, faça upload da nota fiscal referente aos custos extras", typeOfResponse: 'file', isRequired: true, section: 'Nota Fiscal'},
    {id:65, name: "valueNFReferentExtraCosts", question: "Informe o valor da nota fiscal referente aos custos extras.", typeOfResponse: 'number', isRequired: true, section: 'Nota Fiscal'},
    {id:66, name: "CPNJ", question: "Informe seu CNPJ", typeOfResponse: 'text', isRequired: true, section: 'Nota Fiscal'},

    /* Pagamento */
    {id:67, name: "wayOfReceivePayment", question: "Como deseja receber o pagamento?", typeOfResponse: 'lista', isRequired: true, section: 'Pagamento'},
    {id:68, name: "typeKeyPIX", question: "Qual é o tipo da sua chave PIX?", typeOfResponse: 'lista', isRequired: true, section: 'Pagamento'},
    {id:69, name: "PIX", question: "Qual é o seu PIX?", typeOfResponse: 'text', isRequired: true, section: 'Pagamento'},
    {id:70, name: "bank", question: "Qual o seu banco?", typeOfResponse: 'text', isRequired: true, section: 'Pagamento'},
    {id:71, name: "bankAgency", question: "Qual a sua Agência?", typeOfResponse: 'string', isRequired: true, section: 'Pagamento'},
    {id:72, name: "currentAccount", question: "Qual a sua Conta Corrente?", typeOfResponse: 'text', isRequired: true, section: 'Pagamento'},
    /* Finalização  */
    {id:73, name: "pointsOfAttentionCustomerResidence", question: "Deseja relatar pontos de atenção da residência do cliente?", typeOfResponse: 'text', isRequired: true, section: 'Finalizacao'},
  ]

  const invertersArray: inverterProps[] = [
    {
      name: 'BYD-S 3KW MONOFÁSICO 220V',
      MPPT: [
        {name: 'MPPT 1',numberOfInputs: 1}
      ]
    },
    {
      name: 'BYD-K 3KW MONOFÁSICO 220V',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'BYD-S 5KW MONOFÁSICO 220V',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'BYD-K 6KW MONOFÁSICO 220V',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'BYD-S 8KW MONOFÁSICO 220V',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'BYD-K 8KW MONOFÁSICO 220V',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'BYD-K 9KW MONOFÁSICO 220V',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'BYD-S 10KW MONOFÁSICO 220V',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'ELSYS 3KW ESM3000 MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'ELSYS 3KW ESM3000L MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'ELSYS 5KW ESM5000 MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'ELSYS 6,5KW ESM6500 MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'ELSYS 8KW ESM8000 MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 2
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'GROWATT MIC 3000TL-X',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'GROWATT MIN 3000TL-X',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'GROWATT MIN 5000TL-X',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'GROWATT MIN 6000TL-X',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'GROWATT 8000MTL-S',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 2
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'GOODWE 3KW - GW3000-NS',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'GOODWE 5KW - GW5000D-NS',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'GOODWE 8.5KW - GW8500-MS',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'GOODWE 10KW - GW10K-MS',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS MONO 3K S6',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS MONO 3K 1P',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS MONO 4K 1P',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS MONO 5K 1P',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS MONO 6K 1P',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS S5-GR1P 7K',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS S5-GR1P 8K',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS S5-GR1P 9K',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS S5-GR1P 10K',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SOLIS 15K-LV',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 2
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 2
        }]
    }
        ,
        {
            name: 'SOLIS 20K-LV',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 2
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 2
        }]
    }
        ,
        {
            name: 'SUNGROW SG3K RS MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SUNGROW SG4K RS MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SUNGROW SG5K RS MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SUNGROW SG6K RS MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SUNGROW SG8.3K-D MONO',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 2
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SUNGROW SG RS 8K',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SUNGROW SG RS 9K',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }
        ,
        {
            name: 'SUNGROW SG RS 10K',
            MPPT: [
                {
                    name: 'MPPT 1',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 2',
                    numberOfInputs: 1
        }
                ,
                {
                    name: 'MPPT 3',
                    numberOfInputs: 1
        }]
    }]
  const inverterNames = invertersArray.map((inverter) => inverter.name);
  let valuesForm: any = reactive({})
 

  const currentSection = refVue('Identificacao'); // Inicialmente, a seção atual é 'always'

  const questionsPerPage = 21;

  const questions = refVue(dataArray);

  const displayedQuestions = computed(() => {
    const filteredQuestions = questions.value.filter((question) => {
      if (currentSection.value === 'Identificacao') {
        return question.section === 'Identificacao';
      } else if (currentSection.value === 'Foto Geral') {
        return question.section === 'Foto Geral' 
      } else if (currentSection.value === 'Micro e String') {
        return question.section === 'Micro e String'
      }else if (currentSection.value === 'String') {
        return (question.section === 'String' );     
      } else if (currentSection.value === 'Entradas MPPT') {
        return (
          question.section === 'Entradas MPPT' &&
          valuesForm.inverterTypeInstalled === 'Inversor String' &&
          valuesForm.quantityInvertersInstalled > 0
        );
      } else if (currentSection.value === 'Micro') {
        return (question.section === 'Micro' );
        
      } else if (currentSection.value === 'Conexoes') {
        return question.section === 'Conexoes' 
      }else if (currentSection.value === 'Seguranca') {
        return question.section === 'Seguranca' 
      }else if (currentSection.value === 'Monitoramento') {
        return question.section === 'Monitoramento' 
      }else if (currentSection.value === 'Nota Fiscal') {
        return question.section === 'Nota Fiscal' 
      }else if (currentSection.value === 'Pagamento') {
        return question.section === 'Pagamento' 
      }else if (currentSection.value === 'Finalizacao') {
        return question.section === 'Finalizacao' 
      }
      return false;
    });

    return filteredQuestions;
  });

  const totalQuestions = computed(() => displayedQuestions.value.length);
  const totalPages = computed(() => Math.ceil(totalQuestions.value / questionsPerPage));




  const progress = refVue(0)

  const updateProgress = () => {
    const currentSectionIndex = dataArray.findIndex((item) => item.section === currentSection.value);
    const sectionQuestions = dataArray.slice(0, currentSectionIndex + 1).filter(
      (question) =>
        question.section === 'Identificacao' ||
          question.section === 'Foto Geral' ||
            question.section === 'Micro e String' ||
              (question.section === 'String' && valuesForm.inverterTypeInstalled === 'Inversor String') ||
                (question.section === 'Entradas MPPT' && valuesForm.inverterTypeInstalled === 'Inversor String' && valuesForm.quantityInvertersInstalled > 0) ||
                  (question.section === 'Micro' && valuesForm.inverterTypeInstalled === 'Micro') ||
                    (question.section === 'Conexoes') ||
                      (question.section === 'Seguranca') ||
                        (question.section === 'Monitoramento') ||
                          (question.section === 'Pagamento') ||
                            (question.section === 'Finalizacao')
    );        
    const totalSectionQuestions = sectionQuestions.length;
    const answeredSectionQuestions = sectionQuestions.filter((question) => valuesForm[question.name] !== undefined);
    const answeredSectionQuestionsCount = answeredSectionQuestions.length;

    progress.value = (answeredSectionQuestionsCount / totalSectionQuestions) * 100;
  };


  const scrollToTop = () =>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

    // Função para navegar para a próxima seção
  const goToNextSection = () => {
    const currentIndex = dataArray.findIndex((item) => item.section === currentSection.value);
    const nextIndex = dataArray.findIndex((item, index) => index > currentIndex && item.section !== currentSection.value);
    
    if (nextIndex !== -1) {
      if (dataArray[nextIndex].section === 'String') {
        if (valuesForm.inverterTypeInstalled === 'Inversor String') {
          currentSection.value = 'String';
        } else if (valuesForm.inverterTypeInstalled === 'Micro') {
          currentSection.value = 'Micro';
        }
      }else if (dataArray[nextIndex].section === 'Micro') {
        if (valuesForm.inverterTypeInstalled === 'Inversor String') {
          currentSection.value = 'Conexoes';
        } else{
          currentSection.value = 'Micro';
        }
      }else {
        currentSection.value = dataArray[nextIndex].section;
      }
    }

    progress.value+=10

  };

  // Função para navegar para a seção anterior
  const goToPreviousSection = () => {
    const currentIndex = dataArray.findIndex((item) => item.section === currentSection.value);
    const previousIndex = dataArray.slice(0, currentIndex).reverse().findIndex((item) => item.section !== currentSection.value);
    if (previousIndex !== -1) {
      if (dataArray[currentIndex - previousIndex - 1].section === 'Entradas MPPT') {
        if (valuesForm.inverterTypeInstalled === 'Inversor String') {
          currentSection.value = 'Entradas MPPT';
        } else if (valuesForm.inverterTypeInstalled === 'Micro') {
          currentSection.value = 'Micro e String';
        }
      }else if (dataArray[currentIndex - previousIndex - 1].section === 'Micro') {
        if (valuesForm.inverterTypeInstalled === 'Inversor String') {
          currentSection.value = 'Entradas MPPT';
        } else if (valuesForm.inverterTypeInstalled === 'Micro') {
          currentSection.value = 'Micro';
        }
      }else {
        currentSection.value = dataArray[currentIndex - previousIndex - 1].section;
      }
    }
    progress.value-=10
  };
   
  const validationErrors = refVue<Record<string, string | undefined>>({});  

  const validationSchema = yup.object({
    enterpriseName: yup.string().required("Esta pergunta é obrigatória*"),
    responsibleTech: yup.string().required("Esta pergunta é obrigatória*"),
    projectId: yup.number().required("Esta pergunta é obrigatória*"),
    customerName: yup.string().required("Esta pergunta é obrigatória*"),
    installationStartDate: yup.date().required("Esta pergunta é obrigatória*"),
    installationFinalDate: yup.date().required("Esta pergunta é obrigatória*"),
    photoFixingStructure: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoGroundingModules: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoInstalledPanels:  yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoConnectionsEletric: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoInverterConnectionPoint: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoFaceGroundingInverter: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoGroundingAttachmentPoint:  yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoForVisualInspection: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoCAPhaseAndNeutral: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoCAPhaseAndPhase: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoTagModules:  yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoIfProjectsWithBlocker: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoSNIfProjectsWithBlocker: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoInputPattern:  yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoCircuitBreaker:  yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    inverterTypeInstalled: yup.string().required("Esta pergunta é obrigatória*"),
    quantityInvertersInstalled: yup.number().required("Esta pergunta é obrigatória*"),
    photoSNInverterString: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoSNAntennaInverterString: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoDetailedConnectionEletric: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoInstallationOfInvertersCCAndCA: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    locationInverterInstalled: yup.string().required("Esta pergunta é obrigatória*"),
    heightBetweenInverterDisplayAndFloor:  yup.number().required("Esta pergunta é obrigatória*"),
    inverterStringUsed:  yup.string().required("Esta pergunta é obrigatória*"),
    qtdPanelsConnectedSingleInputOfTheSingle:  yup.number().required("Esta pergunta é obrigatória*"),
    photoVoltInverterInput: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoChainInverterInput: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    microInverterInstalled:  yup.string().required("Esta pergunta é obrigatória*"),
    quantityMicroInvertersInstalled:  yup.number().required("Esta pergunta é obrigatória*"),
    howManyInvertersNotCompletelyFull:  yup.number().required("Esta pergunta é obrigatória*"),
    sketchModulesOnTheRoof: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoSNOfAllMicroInverters: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    photoSNOfAntennaMicroInverters: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    thePanelsGroundedTogether:  yup.string().required("Esta pergunta é obrigatória*"),
    allRightCrimpagesConnectorsMC4:  yup.string().required("Esta pergunta é obrigatória*"),
    doubleIsulationCablesWereUsed:  yup.string().required("Esta pergunta é obrigatória*"),
    typeOfPipingUsedAtInstall:  yup.string().required("Esta pergunta é obrigatória*"),
    stringBInvertersAndQBInstallInCoveredPlace:  yup.string().required("Esta pergunta é obrigatória*"),
    whyNotStringBInvertersAndQBInstallInCoveredPlace:  yup.string(),
    installAccordingSinglelineDiagram:  yup.string().required("Esta pergunta é obrigatória*"),
    whyNotInstallAccordingSinglelineDiagram:  yup.string(),
    singlelineProjectDiagram: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    respectedMinimunSoacingInverters:  yup.string().required("Esta pergunta é obrigatória*"),
    whyNotRespectedMinimunSoacingInverters:  yup.string(),
    allStringChecked:  yup.string().required("Esta pergunta é obrigatória*"),
    whyNotAllStringChecked:  yup.string(),
    heldInspectionLocationAfterInstall:  yup.string().required("Esta pergunta é obrigatória*"),
    allEPIsAndEPCsWereUsed:  yup.string().required("Esta pergunta é obrigatória*"),
    photoUseEPIsAndEPCsNecessary: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    monitoringConnectedToHOLUAccount:  yup.string().required("Esta pergunta é obrigatória*"),
    whyNotMonitoringConnectedToHOLUAccount:  yup.string(),
    monitoringLogin:  yup.string().required("Esta pergunta é obrigatória*"),
    monitoringPassword:  yup.string().required("Esta pergunta é obrigatória*"),
    photoAppmonitoringCustomer: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    sendNFsForPaymentNow:  yup.string().required("Esta pergunta é obrigatória*"),
    uploadNFInPDFReferentSecondInstallment: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    valueNFReferentSecontInstallment: yup.number().required("Esta pergunta é obrigatória*"),
    uploadNFReferentExtraCosts: yup.array().max(10, "Você só pode escolher até 10 imagens/videos ").required("Esta pergunta é obrigatória*"),
    valueNFReferentExtraCosts: yup.number().required("Esta pergunta é obrigatória*"),
    CPNJ: yup.string().required("Esta pergunta é obrigatória*"),
    wayOfReceivePayment:  yup.string().required("Esta pergunta é obrigatória*"),
    typeKeyPIX:  yup.string(),
    PIX:  yup.string(),
    bank:  yup.string(),
    bankAgency:  yup.string(),
    currentAccount:  yup.string(),
    pointsOfAttentionCustomerResidence:  yup.string(),
  });   

  
  const hasValidationError = (fieldName: string) => {
    return validationErrors.value[fieldName] !== undefined;
  };

  const getValidationError = (fieldName: string) => {
    return validationErrors.value[fieldName];
  };

  const clearValidationError = (fieldName: string) => {
    validationErrors.value[fieldName] = undefined;
  };

  const validateForm = () => {
    const currentSectionQuestions = displayedQuestions.value.map((question) => question.name);

    const validationPromises = currentSectionQuestions.map((fieldName) =>
      validationSchema
        .validateAt(fieldName, valuesForm, { abortEarly: false })
        .catch((error) => ({ fieldName, error }))
    );

    Promise.all(validationPromises)
      .then((results) => {
        const errors = results.reduce((acc, result) => {
          if (result && result.error) {
            acc[result.fieldName] = result.error.message;
          }
          return acc;
        }, {});

        if (Object.keys(errors).length === 0) {
          goToNextSection();
        } else {
          validationErrors.value = errors;
        }
      });
  };

  const updateSection = (newValue: string) => {
    emit('section-updated', newValue);
  }

  onMounted(() => {
    // Recuperar os valores do localStorage
    const storedValues = localStorage.getItem('forms');
    if (storedValues) {
      valuesForm = JSON.parse(storedValues);
    }
  });

  watch(currentSection, (newValue) => {
    
    scrollToTop();
    updateSection(newValue)
  });

  watch(valuesForm, () =>{
    localStorage.setItem('forms', JSON.stringify(valuesForm))
  })
</script>

<template>

  <div class="container">
    <v-list class="bg-transparent" style="width: 100%;" id="questions-container">
      <v-list-item
        v-for="data in displayedQuestions"
        :key="data.name"
        style="width: 100%;"
      >
        <!-- 1 - PERGUNTAS, IDENTIFICACAO, FOTO GERAL, STRING E MICRO -->
        <div
          class="container-molecule-form"
          :class="{ 'is-invalid': validationErrors[data.name] }"
          v-if="
            data.section !== 'Micro'
            && data.section !== 'String'
            && data.section !== 'Entradas MPPT'
            && data.name !== 'whyNotStringBInvertersAndQBInstallInCoveredPlace'
            &&  data.name !== 'whyNotInstallAccordingSinglelineDiagram'
            &&  data.name !== 'whyNotRespectedMinimunSoacingInverters'
            &&  data.name !== 'whyNotAllStringChecked'
            &&  data.name !== 'whyNotMonitoringConnectedToHOLUAccount'
            &&  data.name !== 'uploadNFInPDFReferentSecondInstallment'
            &&  data.name !== 'valueNFReferentSecontInstallment'
            &&  data.name !== 'uploadNFReferentExtraCosts'
            &&  data.name !== 'valueNFReferentExtraCosts'
            &&  data.name !== 'CPNJ'
            &&  data.name !== 'wayOfReceivePayment'
            &&  data.name !== 'typeKeyPIX'
            &&  data.name !== 'PIX'
            &&  data.name !== 'bank'
            &&  data.name !== 'bankAgency'
            &&  data.name !== 'currentAccount'
          "
        >
          <labelVue 
            :text="data.id+'. '+data.question" 
            :name-input="data.name"  
            v-if="data.name !== 'quantityInvertersInstalled'"
          />
          <div v-if="data.typeOfResponse === 'file'"  class="imagesDemo-container" :style="`background-image: url(/src/assets/fotos/${data.id}.png  ); background-color: lightgray; background-position: 50%; background-size: cover; background-repeat: no-repeat;`"/>
          
          <inputVue
            
            v-if="
            data.name !== 'inverterTypeInstalled'
            && data.name !== 'microInverterInstalled'
            && data.name !== 'microInverterInstalled'
            && data.name !== 'stringBInvertersAndQBInstallInCoveredPlace'
            && data.name !== 'installAccordingSinglelineDiagram'
            && data.name !== 'respectedMinimunSoacingInverters'
            && data.name !== 'thePanelsGroundedTogether'
            && data.name !== 'allRightCrimpagesConnectorsMC4'
            && data.name !== 'doubleIsulationCablesWereUsed'
            && data.name !== 'typeOfPipingUsedAtInstall'
            && data.name !== 'allStringChecked'
            && data.name !== 'heldInspectionLocationAfterInstall'
            && data.name !== 'allEPIsAndEPCsWereUsed'
            && data.name !== 'monitoringConnectedToHOLUAccount'
            && data.name !== `sendNFsForPaymentNow`
            && data.typeOfResponse !== 'file'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          />

          <InputFile
            v-else-if="
              data.typeOfResponse === 'file'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
           
            @change="(event) => {
              clearValidationError(data.name);
            
            }"
          />

          <SelectVue v-if="data.name === 'inverterTypeInstalled'" v-model="valuesForm[data.name]"  name-select="inverterTypeInstalled" :required-input="data.isRequired" :items="['Inversor String', 'Micro']"  @change="clearValidationError(data.name)"/>

          <SelectVue 
            v-if="
              data.name === 'microInverterInstalled'
            "  
            name-select="microInverterInstalled" 
            :required-input="data.isRequired"
            :items="['APSYSTEMS DS3D 2000W','Enphase IQ7AM','Hoymiles - 1500 - 2MPPTS','Hoymiles 2000 - HMS-2000B-4T - 2MPPTS', 'Hoymiles 2000 - HMS-2000-4T - 4MPPTS']"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          /> 

          <!--  SELECT SIM/NÃO -->
          <SelectVue 
            v-if="
              data.name === 'thePanelsGroundedTogether'
              || data.name === 'allRightCrimpagesConnectorsMC4'
              || data.name === 'stringBInvertersAndQBInstallInCoveredPlace'
              || data.name === 'installAccordingSinglelineDiagram'
              || data.name === 'respectedMinimunSoacingInverters'
              || data.name === 'doubleIsulationCablesWereUsed'
              || data.name === 'allStringChecked'
              || data.name === 'heldInspectionLocationAfterInstall'
              || data.name === 'allEPIsAndEPCsWereUsed'
              || data.name === 'monitoringConnectedToHOLUAccount'
              || data.name === `sendNFsForPaymentNow`
            "  
            :name-select="data.name" 
            :required-input="data.isRequired"
            :items="['Sim', 'Não']"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          />  

          <SelectVue 
            v-if="
              data.name === 'typeOfPipingUsedAtInstall'
            "  
            :name-select="data.name" 
            :required-input="data.isRequired"
            :items="['Conduíte corrugado anti-chamas embutido','Conduíte corrugado anti-chamas','Eletroduto galvanizado (chapa média)', 'Eletroduto PVC anti-chamas', 'Eletrocalha galvanizada (chapa média)']"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          /> 

          <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
        </div>

          <!--    PERGUNTAS POR QUE NÃO -->
        <div
          v-if="
            data.name === 'whyNotStringBInvertersAndQBInstallInCoveredPlace'
            && valuesForm.stringBInvertersAndQBInstallInCoveredPlace === 'Não'
            || data.name === 'whyNotInstallAccordingSinglelineDiagram'
            && valuesForm.installAccordingSinglelineDiagram === 'Não'
            || data.name ===  'whyNotRespectedMinimunSoacingInverters'
            && valuesForm.respectedMinimunSoacingInverters === 'Não'
            || data.name === 'whyNotAllStringChecked'
            && valuesForm.allStringChecked === 'Não'
            ||  data.name === 'whyNotMonitoringConnectedToHOLUAccount'
            && valuesForm.monitoringConnectedToHOLUAccount === 'Não'
          "
          class="container-molecule-form"
          :class="{ 'is-invalid': validationErrors[data.name] }"
        >

          <labelVue 
            :text="data.id+'. '+data.question" 
            :name-input="data.name"  
          />
          <inputVue
            @change="clearValidationError(data.name)"
            
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            v-model="valuesForm[data.name]"
           
          />
          <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
        </div>

        <!-- 2 - PERGUNTAS SE INVERSOR MICRO -->
        <div
          class="container-molecule-form"
          :class="{ 'is-invalid': validationErrors[data.name] }"
          v-if="
            data.section === 'Micro'
          "
        >
          <labelVue 
            :text="data.id+'. '+data.question" 
            :name-input="data.name"  
          />
          <div v-if="data.typeOfResponse === 'file'"  class="imagesDemo-container" :style="`background-image: url(/src/assets/fotos/${data.id}.png  ); background-color: lightgray; background-position: 50%; background-size: cover; background-repeat: no-repeat;`"/>
          <inputVue
            @change="clearValidationError(data.name)"
            v-if="
              data.name !== 'microInverterInstalled'
              && data.typeOfResponse !== 'file'
            " 
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            v-model="valuesForm[data.name]"
          />
          <InputFile
            v-else-if="
              data.typeOfResponse === 'file'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            @change="(event) => {
              clearValidationError(data.name);
              valuesForm[data.name] = [event.target.files];
            }"
          />

          <SelectVue 
            v-if="
              data.name === 'microInverterInstalled'
            "  
            name-select="microInverterInstalled" 
            :required-input="data.isRequired"
            :items="['APSYSTEMS DS3D 2000W','Enphase IQ7AM','Hoymiles - 1500 - 2MPPTS','Hoymiles 2000 - HMS-2000B-4T - 2MPPTS', 'Hoymiles 2000 - HMS-2000-4T - 4MPPTS']"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          /> 

          <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
        </div>

        <!-- 3 - PERGUNTAS SE INVERSOR STRING -->
        <div
          class="container-molecule-form"
          :class="{ 'is-invalid': validationErrors[data.name] }"
          v-if="
            data.section === 'String'
            && valuesForm.inverterTypeInstalled === 'Inversor String'
          "
        >
          <labelVue 
            :text="data.id+'. '+data.question"  
            :name-input="data.name"  
          />
          <div v-if="data.typeOfResponse === 'file'"  class="imagesDemo-container" :style="`background-image: url(/src/assets/fotos/${data.id}.png  ); background-color: lightgray; background-position: 50%; background-size: cover; background-repeat: no-repeat;`"/>
          <inputVue
            @change="clearValidationError(data.name)"
            v-if="
              data.name !== 'microInverterInstalled'
              && data.typeOfResponse !== 'file'
            " 
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            v-model="valuesForm[data.name]"
          />

          <InputFile
            v-else-if="
              data.typeOfResponse === 'file'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            @change="(event) => {
              clearValidationError(data.name);
              valuesForm[data.name] = [event.target.files];
            }"
          />
          <SelectVue 
            v-if="
              data.name === 'microInverterInstalled'"  
              name-select="microInverterInstalled" 
              :required-input="data.isRequired
            "
            :items="['APSYSTEMS DS3D 2000W','Enphase IQ7AM','Hoymiles - 1500 - 2MPPTS','Hoymiles 2000 - HMS-2000B-4T - 2MPPTS', 'Hoymiles 2000 - HMS-2000-4T - 4MPPTS']"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          /> 

          <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
        </div>

        <!-- REPETIÇÃO DA PERGUNTA 30 e em seguida 31,32,33 - INVERSOR STRING-->
        <div 
          v-else-if="
            data.section === 'Entradas MPPT'
            && valuesForm.inverterTypeInstalled === 'Inversor String'
            && valuesForm.quantityInvertersInstalled > 0
          "
        >
          <div v-for="(inverter,index) in Number(valuesForm.quantityInvertersInstalled)" :key="index">
            <div class="container-molecule-form" :class="{ 'is-invalid': validationErrors[data.name] }" v-if="data.name === 'inverterStringUsed'">
              <labelVue :text="'Qual o '+ (inverter) +'º inversor string utilizado?'" :name-input="data.name"/>
              <SelectVue 
                v-if="data.name === 'inverterStringUsed'"
                :name-select="data.name"
                :required-input="data.isRequired"
                :items="inverterNames"
                v-model="valuesForm[data.name + (inverter)]"
                @change="clearValidationError(data.name)"
              /> 
              <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
            </div>

            <template v-for="(inverterItem, itemIndex) in invertersArray" :key="itemIndex">
              <template
                v-if="
                  valuesForm[data.name + (index + 1)] === inverterItem.name
                "
              >
                <div v-for="(mppt, mpptIndex) in inverterItem.MPPT" :key="mpptIndex">
                  <div v-for="(input, inputIndex) in mppt.numberOfInputs" :key="inputIndex" class="container-molecule-form" :class="{ 'is-invalid': validationErrors[data.name] }">
                    <div v-if="valuesForm[data.name + (index + 1)] === inverterItem.name">
                      <labelVue :text="'Quantos painéis foram conectados a '+input+' entrada do '+mppt.name+' deste inversor?'" :name-input="'qtdPanelsConnectedSingleInput'+input+'OfTheSingle'+mppt.name+'Of'+inverter+'º'+inverterItem.name"/>
                      <inputVue
                        @change="clearValidationError(data.name)" 
                        :name-input="'qtdPanelsConnectedSingleInput'+input+'OfTheSingle'+mppt.name+'Of'+inverter+'º'+inverterItem.name"
                        :required-input="data.isRequired"
                        type-input="number"
                        placeholder-input="Insira sua resposta"
                        v-model="valuesForm['qtdPanelsConnectedSingleInput'+input+'OfTheSingle'+mppt.name+'Of'+inverter+'º'+inverterItem.name]"
                      />
                    </div>
                    <span v-if="hasValidationError(data.name)" class="error-message">
                      <v-icon left class="info-icon">mdi-information</v-icon>
                      <span>{{ getValidationError(data.name) }}</span>
                    </span>
                  </div>
                </div>
                 <!-- foto tensão  -->
                 <div  class="container-molecule-form" :class="{ 'is-invalid': validationErrors[data.name] }">
                    <div v-if="valuesForm[data.name + (index + 1)] === inverterItem.name">
                      
                      <labelVue text="32. Envie uma foto da tensão dessa entrada do inversor" :name-input="'photoVoltInverterInput'+'Of'+inverter+'º'+inverterItem.name"/>
                      <div class="imagesDemo-container" :style="`background-image: url(/src/assets/fotos/${32}.png  ); background-color: lightgray; background-position: 50%; background-size: cover; background-repeat: no-repeat;`"/>
                      <InputFile
                       
                        :name-input="'photoVoltInverterInput'+'Of'+inverter+'º'+inverterItem.name"
                        :required-input="data.isRequired"
                        type-input="file"
                        placeholder-input="Insira sua resposta"
                        @change="(event) => {
                          clearValidationError(data.name);
                          valuesForm[data.name] = [event.target.files];
                        }"
                      />
                      
                    </div>
                    <span v-if="hasValidationError(data.name)" class="error-message">
                      <v-icon left class="info-icon">mdi-information</v-icon>
                      <span>{{ getValidationError(data.name) }}</span>
                    </span>
                  </div>
                  <!-- foto corrente -->
                  
                  <div  class="container-molecule-form" :class="{ 'is-invalid': validationErrors[data.name] }">
                    <div v-if="valuesForm[data.name + (index + 1)] === inverterItem.name">
                      
                      <labelVue text="33. Envie uma foto da corrente dessa entrada do inversor" :name-input="'photoChainInverterInput'+'Of'+inverter+'º'+inverterItem.name"/>
                      <div class="imagesDemo-container" :style="`background-image: url(/src/assets/fotos/${33}.png  ); background-color: lightgray; background-position: 50%; background-size: cover; background-repeat: no-repeat;`"/>
                      <InputFile
                       
                        :name-input="'photoChainInverterInput'+'Of'+inverter+'º'+inverterItem.name"
                        :required-input="data.isRequired"
                        type-input="file"
                        placeholder-input="Insira sua resposta"
                        @change="(event) => {
                          clearValidationError(data.name);
                          valuesForm[data.name] = [event.target.files];
                        }"
                      />
                    </div>
                    <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
                  </div>
              </template>
            </template>
          </div>
        </div>  

        <!--  NOTA FISCAL -->
        <div
          class="container-molecule-form"
          :class="{ 'is-invalid': validationErrors[data.name] }"
          v-if="
            data.name !== 'sendNFsForPaymentNow'
            && valuesForm.sendNFsForPaymentNow === 'Sim'
            && data.section === 'Nota Fiscal'
            
          "
        >
          <labelVue 
            :text="data.id+'. '+data.question" 
            :name-input="data.name"  
          />
          
          <inputVue
            
            v-if="
             data.typeOfResponse !== 'file'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          />

          <InputFile
            v-else-if="
              data.typeOfResponse === 'file'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            @change="(event) => {
              clearValidationError(data.name);
              valuesForm[data.name] = [event.target.files];
            }"
          />

          <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
        </div>

        <!--  PAGAMENTO -->
        <div
          class="container-molecule-form"
          :class="{ 'is-invalid': validationErrors[data.name] }"
          v-if="
            valuesForm.sendNFsForPaymentNow === 'Sim'
            && data.section === 'Pagamento'
            && data.name !== 'sendNFsForPaymentNow'
            && data.name !== 'typeKeyPIX'
            && data.name !== 'PIX'
            && data.name !== 'bank'
            && data.name !== 'bankAgency'
            && data.name !== 'currentAccount'
          "
        >
          <labelVue 
            :text="data.id+'. '+data.question" 
            :name-input="data.name"  
          />
          
          <inputVue
            
            v-if="
             data.typeOfResponse !== 'file'
             && data.name !== 'wayOfReceivePayment'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          />

          <InputFile
            v-else-if="
              data.typeOfResponse === 'file'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            @change="(event) => {
              clearValidationError(data.name);
              valuesForm[data.name] = [event.target.files];
            }"
          />

          <SelectVue 
            v-if="
              data.name === 'wayOfReceivePayment'
            "  
            name-select="wayOfReceivePayment" 
            :required-input="data.isRequired"
            :items="['PIX', 'TRANSFERÊNCIA']"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          /> 
          <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
        </div>
        <!-- SE PIX -->
        <div
          class="container-molecule-form"
          :class="{ 'is-invalid': validationErrors[data.name] }"
          v-if="
            valuesForm.wayOfReceivePayment === 'PIX'
            && data.section === 'Pagamento'
            && data.name !== 'uploadNFInPDFReferentSecondInstallment'
            && data.name !== 'valueNFReferentSecontInstallment'
            && data.name !== 'uploadNFReferentExtraCosts'
            && data.name !== 'valueNFReferentExtraCosts'
            && data.name !== 'CPNJ'
            && data.name !== 'wayOfReceivePayment'
            && data.name !== 'sendNFsForPaymentNow'
            && data.name !== 'bank'
            && data.name !== 'bankAgency'
            && data.name !== 'currentAccount'

          "
        >
          <labelVue 
            :text="data.id+'. '+data.question" 
            :name-input="data.name"  
          />
          <div v-if="data.typeOfResponse === 'file'"  class="imagesDemo-container" :style="`background-image: url(/src/assets/fotos/${data.id}.png  ); background-color: lightgray; background-position: 50%; background-size: cover; background-repeat: no-repeat;`"/>
          <inputVue
            @change="clearValidationError(data.name)"
            v-if="
             data.typeOfResponse !== 'file'
             && data.name !== 'wayOfReceivePayment'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            v-model="valuesForm[data.name]"
           
          />

          <InputFile
            v-else-if="
              data.typeOfResponse === 'file'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            @change="(event) => {
              clearValidationError(data.name);
              valuesForm[data.name] = [event.target.files];
            }"
          />

          <SelectVue 
            v-if="
              data.name === 'wayOfReceivePayment'
            "  
            name-select="wayOfReceivePayment" 
            :required-input="data.isRequired"
            :items="['PIX', 'TRANSFERÊNCIA']"
            v-model="valuesForm[data.name]"
            @change="clearValidationError(data.name)"
          /> 
          <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
        </div>

        <!-- SE TRANSFERÊNCIA -->
        <div
          class="container-molecule-form"
          :class="{ 'is-invalid': validationErrors[data.name] }"
          v-if="
            valuesForm.wayOfReceivePayment === 'TRANSFERÊNCIA'
            && data.section === 'Pagamento'
            && data.name !== 'uploadNFInPDFReferentSecondInstallment'
            && data.name !== 'valueNFReferentSecontInstallment'
            && data.name !== 'uploadNFReferentExtraCosts'
            && data.name !== 'valueNFReferentExtraCosts'
            && data.name !== 'CPNJ'
            && data.name !== 'wayOfReceivePayment'
            && data.name !== 'sendNFsForPaymentNow'
            && data.name !== 'typeKeyPIX'
            && data.name !== 'PIX'
          "
        >
          <labelVue 
            :text="data.id+'. '+data.question" 
            :name-input="data.name"  
          />
          <inputVue
            @change="clearValidationError(data.name)"
            v-if="
             data.typeOfResponse !== 'file'
            "
            :name-input="data.name"
            :required-input="data.isRequired"
            :type-input="data.typeOfResponse"
            placeholder-input="Insira sua resposta"
            v-model="valuesForm[data.name]"
           
          />
          <span v-if="hasValidationError(data.name)" class="error-message">
            <v-icon left class="info-icon">mdi-information</v-icon>
            <span>{{ getValidationError(data.name) }}</span>
          </span>
        </div>
      </v-list-item>
    </v-list>
    <div class="container-buttons">
      <v-btn  @click="goToPreviousSection" :disabled="currentSection === 'Identificacao' ? true : false">Anterior</v-btn>
      <div class="container-progress-bar">
        <v-progress-linear v-model="progress" :max="valuesForm.inverterTypeInstalled === 'Inversor String' ? '100' : '90'" color="#1f4997"></v-progress-linear>
      </div>
      <v-btn v-if="currentSection !== 'Finalizacao'"  @click="goToNextSection">Próximo</v-btn>
    </div>
  </div>  
 
</template>

<style>
.container{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.container-molecule-form {  
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin: 0.5rem 0;
  gap: 1rem;
  background-color: #FFF;
  border-radius: 0.5rem;
  border: 1px solid var(--gray-400, #CCC);
}

.imagesDemo-container{
  width: 100%;
  height: 16.375rem;
 

}
.container-buttons{
  width: 88%;
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 1rem;
}

 button:disabled{
  opacity: .5;
  cursor: not-allowed;
 }

 .container-progress-bar{
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-start;
    z-index: 9999;
  }

  .is-invalid {
    border-color: rgb(217,48,37);
  }
  .error-message {
    color: rgb(217,48,37);
    display: flex;
    gap: .4rem;
    justify-content: left;
    align-items: center;
  }
  .info-icon{
    color: rgb(217,48,37);  
  }
</style>

