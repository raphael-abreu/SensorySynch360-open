import Translator from './vendor/simple-translator@2.0.4.js';

let translator = new Translator();
let ptbrTranslation = {
wait: "Espere...",
close: "Feche a janela",
header: {
    subtitle: "EDITOR DE EFEITOS SENSORIAIS EM 360",
},
videoUpload: "Carregando video...",
working: "Trabalhando no seu vídeo...",
willClose: "Ao finalizar essa janela será fechada automaticamente",
import:"Importar",
export:"Exportar",
effect:{
    wind: "vento",
    cold: "frio",
    heat: "calor",
    vibration: "vibração",
    aroma: "aroma",
    light: "luz",
    isAmbient:"efeito de ambiente",
    update:"Atualizar propriedades"
},

opt:{
    light:"Cor da luz",
    aroma:"Tipo de aroma",
},
keyframe:{
    position:"Posição",
    size:"Tamanho",
    deg:"graus",
    update:"Atualizar Keyframe",
    delete: "Deletar",
    copy: "copiar do keyframe anterior"

},
effectList:"Lista de Efeitos",
label: "Rótulo",
intensity:"Intensidade:",
propagation:"Dispersão:",
autoextraction: "Extração automática",
module:{
    title : "Selecione",
    showLabelsBtn: "Mostrar os rótulos reconhecidos",
    more:"Mais módulos em breve!",
    begin: "Iniciar extração automática",
    found: "Encontrou os rótulos",
    nextStep : "Na próxima etapa, você pode ativar efeitos sensoriais sempre que cada rótulo aparecer.",
    localization: {
        title: "Localização de Objetos",
        description:"Encontra quando e onde um objeto aparece",
    },
    understanding: {
        title: "Descrição de ambiente",
        description:"Descreve objetos e uma cena inteira",
    },
    sun: {
        title: "Localização de Sol",
        description:"Localiza quando e onde o sol aparece",
    },
    fire: {
        title: "Localização de Fogo",
        description:"Encontra quando e onde fogo aparece",
    },
},
generation: {
    addEffect : "Adicionar efeito",
    finish: "Terminar extração automática",
    title: "Geração de efeitos sensoriais",
    select: "Selecione rótulo",
    ready: "Quando estiver pronto para editar os efeitos gerados, clique abaixo.",
},
filter: {
    description:"Aplique regras para filtrar e combinar as saídas dos módulos usando predefinições",
    presets: {
      select: "Selecione uma preset",
      nothing: "nada",
      reduceHeat: "Reduzir calor se encontrar frio",
      windAroma: "Vento soprará aromas",
      ambientIntensity: "Aplique intensidade ambiente"
    },
    upload: "Faça o upload da sua própria versão",
    download: {
      desc: "Baixe um arquivo de exemplo",
      here: "aqui",
    },
  },
  alert: {
    keyframeDelete: "Você não pode excluir um keyframe de inicio/fim",
    keyframeCopy: "Nao existem keyframes anteriores para copiar",
    keyframeCreated: "já foi criada",
    keyframeout : "O keyframe não pode ser colocado antes ou depois da duração do infospot.",
    confirm: "Os rótulos já estão disponíveis. Clique em 'OK' para usar a resposta armazenada ou 'Cancelar' para atualizar com uma nova resposta.",
    test: {
        start : "Iniciar tarefa",
        finish: "Finalizar tarefa",
        begin: "A tarefa de teste está começando",
        end: "Obrigado! A tarefa está concluída. Agora você pode fechar esta janela",
        error:"Ocorreu um erro no envio dos dados. Tente novamente em 10 segundos.",
    }
}
};



let enTranslation = {
    wait: "Wait...",
    close : "Close the window...",
    header: {
        subtitle: "360 SENSORY EFFECTS EDITOR",
    },
    videoUpload: "Loading video...",
    working : "Working on your video...",
    willClose : "This window will close automatically",
    import: "Import",
    export: "Export",
    effect: {
        wind: "wind",
        cold: "cold",
        heat: "heat",
        vibration: "vibration",
        aroma: "aroma",
        light: "light",
        isAmbient: "ambient effect",
        update: "Update properties",
    },
    opt: {
        light: "Light color",
        aroma: "Aroma type",
    },
    keyframe: {
        position: "Position",
        size: "Size",
        deg: "degrees",
        update: "Update keyframe",
        delete: "Delete",
        copy: "Copy from previous keyframe"

    },
    effectList: "Effect List",
    label: "Label",
    intensity: "Intensity:",
    propagation: "Falloff:",
    autoextraction: "Automatic Extraction",
    module: {
        title: "Select",
        showLabelsBtn: "Show recognized labels",
        more: "More modules coming soon!",
        begin: "Start automatic extraction",
        found: "Found labels",
        nextStep: "In the next step, you can activate sensory effects whenever each label appears.",
        localization: {
            title: "Object Localization",
            description: "Finds when and where an object appears",
        },
        understanding: {
            title: "Ambient Description",
            description: "Describes concepts/objects in a entire scene",
        },
        sun: {
            title: "Sun Localization",
            description: "Locates when and where the sun appears",
        }, 
        fire: {
            title: "Fire Localization",
            description: "Locates when and where fire appears",
        },
    },
    generation: {
        addEffect : "Add effect",
        finish: "Finish Autoextraction",
        title: "Sensory Effects Generation",
        select: "Select label",
        ready: "When you're ready to edit the generated effects, click below.",
    },
    filter: {
        description: "Apply rules to filter and combine module outputs using presets",
        presets: {
            select: "Select a preset",
            nothing: "nothing",
            reduceHeat: " Reduce heat if cold",
            windAroma: "Wind will blow aromas",
            ambientIntensity: "Apply ambient intensity"
        },
        upload: "Upload your own version",
        download: {
            desc: "Download an example file",
            here: "here",
        },
    },
    alert: {
        keyframeDelete: "You cannot delete a start/end keyframe",
        keyframeCopy: "You have no keyframes before to copy",
        keyframeCreated: "already created",
        keyframeout: "Keyframe cannot be placed before or after infospot duration.",
        confirm: "Labels are already available. Click 'OK' to use the stored response or 'Cancel' to update with a new response.",
        test: {
            start : "Start task",
            finish: "Finish task",
            begin: "Test task is starting",
            end: "Thank you! The task is completed. You can now close this window",
            error: "An error occurred in data submission. Please try again in 10 seconds.",
        },
    },
};


translator.add("en", enTranslation);
translator.add("pt", ptbrTranslation);

export default translator;