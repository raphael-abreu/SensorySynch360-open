import { createSequence } from "./vendor/tooltip-sequence.js";

const editOptionsEn = {
  backdropColor: "rgba(106, 142, 240, 0.54)",
  sequence: [
    {
      element: "#uploadButton",
      description:
        "Welcome!<br> Click next to automatically load a video.<br>Please be patient while the video loads...",
      placement: "bottom",
      action() {
        console.log("acabou primeiro passo");
        loadPanorama();
        document.getElementById("panoPanel").style.zIndex = "1001";
      },
    },
    {
      element: "#panoPanel",
      description:
      '<strong>Attention!</strong> This highlighted area below 👇 indicates interactive tasks for you to do<div class="tutorial-interactive"><strong>1) Rotate the video view until you spot the man with the flamethrower </strong><br>- To rotate: click and drag</div>Click next when finished.',
      placement: "right",
      action() {
        document.getElementById("panoPanel").style.zIndex = null;
        // document.getElementById('panoPanel').style.position = null;
        document.getElementById("timelineConteiner").style.zIndex = "1001";
      },
    },
    {
      element: "#mainPanel",
      description:
      'Below we have our timeline. <div class="tutorial-interactive">1) Play and then pause the video</br>2) Click and drag anywhere in the timeline to move the video.</div>Click next when finished.' ,
      placement: "right",
      action() {
        document.getElementById("mainPanel").style.zIndex = "1001";
        playTimeline();
        pauseTimeline();
      },
    },
    {
      element: "#mainPanel",
      description:
      'Now let\'s add sensory effects. <div class="tutorial-interactive">1) Drag the VIBRATION effect above the man in the video.</div>Click next when finished.',
      placement: "right",
      action() {
        if (!window.clickedInfospot) {
          alert("Vibration effect added automatically");
          addSampleInfospot(0, 0);
        }
        document.getElementById("mainPanel").style.zIndex = null;
      },
    },
    {
      element: "#mainPanel",
      description:
      "This is a <strong>local effect</strong>. It has a defined position in the scene, that is, the user will feel a vibration coming only from that position and size.",
      placement: "right",
    },
    {
      element: "#panelContainer",
      description:
      "When we click on the effect, a window opens to modify the <strong>properties</strong> of that effect. </br>You can also change it to <strong>ambient</strong>, which applies the effect to the entire 360 scene .",
      placement: "left",
      action() {
        document.getElementById("panelContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#panelContainer",
      description:
      'Change the effect. <div class="tutorial-interactive">1) Change the effect type to <strong>aroma</strong> </br>2) set the aroma type to <strong>smoke</strong></br> 3) mark the effect as <strong>ambient</strong></br>4) Click UPDATE PROPERTIES.</div> Click next when finished.',
      placement: "left",
      action() {
        document.getElementById("panelContainer").style.zIndex = null;
      },
    },
    {
      element: "#mainPanel",
      description:
      'Notice that the effect no longer has the purple box around it, which means it is <strong>ambient</strong> and will be applied to the entire scene. For a user, this means they will smell smoke <strong><u>coming from all sides</u></strong>.',
      placement: "right",
      action() {
        document.getElementById("panelContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#panelContainer",
      description:
      'Let\'s go back with our effect to the <strong>local</strong> type <div class="tutorial-interactive">1) Uncheck the option <strong>ambient effect</strong></br>2) Click Click UPDATE PROPERTIES.</div> Click next when finished.',
      placement: "left",
      action() {
        document.getElementById("panelContainer").style.zIndex = null;
        document.getElementById("timelineConteiner").style.zIndex = "1001";
      },
    },
    {
      element: "#timelineConteiner",
      description:
      "A yellow bar appears in the timeline, indicating the moment the effect appears in the video.",
      placement: "top",
      action() {},
    },
    {
      element: "#left-handle-trim",
      description:
      "This bar has start and end indicators for the effect. These will be called <strong>keyframes</strong> of the effect. You can drag them to change when the effect appears in the video.",
      placement: "top",
      action() {},
    },
    {
      element: "#timelineConteiner",
      description:
      'Let\'s do it now. <div class="tutorial-interactive"> <strong>1) Change the start to 1s and end to 4s</strong></br> - Adjust the duration of the effect by dragging the start and end keyframes.</div > Click next when finished.',
      placement: "top",
      action() {
        let { prevKeyframe, nextKeyframe } = getEffectBeginEndTime();
        if(prevKeyframe != 1 && nextKeyframe != 4){
          alert("Keyframe updated automatically");
          doSetEffectTime(1, 4);
        }
        playTimeline();
      },
    },
    {
      element: "#panoPanel",
      description:
      'Now this effect starts in 1s and ends in 4s. Keyframes also save the position, size, and intensity of the effect at a given point in time. Next, we will modify the size of the aroma effect in the second 1.',
      placement: "right",
      action() {
        pauseTimeline();
      },
    },
    {
      element: "#left-handle-trim",
      description:
      'To select a keyframe for modification. <div class="tutorial-interactive"> </strong>1) Single click on the first keyframe to select it.</strong></div>Click next when finished.',
      placement: "top",
      action() {
        document.getElementById("timelineConteiner").style.zIndex = null;
        const res = getTrimClickedId();
        if(res == null || res.id != "left-handle-trim"){
          alert("Cliked automatically");
          clickStartTrim();
        }
      },
    },
    {
      element: "#propertiesButtons",
      description: "This set of buttons allows you to change the position and size of the effect.",
      placement: "left",
      action() {},
    },
    {
      element: "#effectSizeConteiner",
      description:
      "The default size of the sensory effect is 20x20 degrees.",
      placement: "left",
      action() {},
    },
    {
      element: "#intensityRangeConteiner",
      description:
      "A higher intensity value results in a stronger effect.",
      placement: "left",
      action() {
        document.getElementById("keyframePropertiesPanel").style.zIndex = "1001";
      },
    },
    {
      element: "#keyframePropertiesPanel",
      description:
      "Make an example. <div class='tutorial-interactive'>1) Change the position and size of the effect using the buttons.<br>2) Click UPDATE KEYFRAME.</div>Click next when finished." ,
      placement: "left",
      action() {
        document.getElementById("keyframePropertiesPanel").style.zIndex = null;
      },
    },
    {
      element: "#keyframePropertiesPanel",
      description:
      "Great. Now let's see how to make animations. Let's illustrate this by creating a new effect.",
      placement: "left",
      action() {
        addSampleInfospotAnimated(3, -71);
        document.getElementById("mainPanel").style.zIndex = "1001";
        clickStartTrim();

      },
    },
    {
      element: "#panoPanel",
      description:
      "This is a heat effect, in the initial keyframe (second 1) it is 20x20 in size with 50% intensity.",
      placement: "right",
      action() {
        document.getElementById("mainPanel").style.zIndex = null;

      },
    },
    {
      element: "#right-handle-trim",
      description:
      'Now let\'s click on the final keyframe to see what it looks like. Click next to do it automatically.',
      placement: "top",
      action() {
        document.getElementById("timelineConteiner").style.zIndex = null;
        clickEndingTrim();
      },
    },
    {
      element: "#panelContainer",
      description:
      "This keyframe defines 100% intensity and a size of 30x30. </br>When we have two keyframes with different properties, the system will <strong> automatically animate</strong> the effect. Click next to play the video .",
      placement: "left",
      action() {
        playTimeline();

      },
    },
    {
      element: "#panoPanel",
      description:
      "Notice that the effect is making an animation between the properties defined in start and end. This is useful for you to make an effect move around the environment. For example, following the fire.",
      placement: "right",
      action() {
        pauseTimeline();
        clickEndingTrim();
        document.getElementById("mainPanel").style.zIndex = null;
        document.getElementById("timelineConteiner").style.zIndex = "1001";
      },
    },
    {
      element: "#timelineConteiner",
      description:
      'You can also add new <strong>keyframes</strong> mid-effect. Let\'s create a new one now. <div class="tutorial-interactive">1) Double click on 2s in the timeline.<br>2) Make sure the keyframe turns yellow; click again if necessary.</div>Click next when finished.',
      placement: "top",
      action() {
        document.getElementById("timelineConteiner").style.zIndex = null;
        document.getElementById("panelContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#mainPanel",
      description:
      'Now edit the properties of this keyframe:<div class="tutorial-interactive">1) Adjust the effect to a new position using the arrows in the right panel.<br>2) Click UPDATE keyframe after changes.</br> </div>Click next when finished.',
      placement: "left",
      action() {
        playTimeline();
        document.getElementById("panelContainer").style.zIndex = null;
      },
    },
    {
      element: "#panoPanel",
      description: "Great! You\'ve created a more complex effect. Let's recap: </br>- An effect has at least two keyframes (start and end)</br>- Each keyframe clicked allows you to change properties of the effect at that moment</br>-If we change a keyframe and play the video, we will see that the system made an animation between the properties.",
      placement: "right",
      action() {
        pauseTimeline();
        clickEndingTrim();

      },
    },
    {
      element: "#panelContainer",
      description:
      "At the top of this panel you will see two buttons, Copy and Delete. Let's learn more about them.",
      placement: "left",
      action() {
      },
    },
    {
      element: "#delete-keyframe",
      description:
      "[Delete] when clicked removes the current keyframe. Note that start and end keyframes cannot be deleted.",
      placement: "left",
      action() {
        document.getElementById("copy-keyframe").click();
      },
    },
    {
      element: "#copy-keyframe",
      description:
      "[Copy] means you can replace the value of the current keyframe with the one immediately before it in the timeline. </br> Click next to do it automatically.",
      placement: "left",
      action() {
        document.getElementById("copy-keyframe").click();
        playTimeline();

      },
    },

    {
      element: "#mainPanel",
      description:
      "Now the properties of the final keyframe have been exchanged for those of the keyframe you created in 2s. This is useful if you want an effect to stay still (without animation) for a longer period of time.",
      placement: "left",
      action() {
        pauseTimeline();
      },
    },
    {
      element: "#infospotListPanel",
      description: "In this panel, you will see all the effects in the scene.",
      placement: "left",
      action(){
        addSampleInfospotAmbient(15,15);
      }
    },
    {
      element: "#listContainer",
      description: "In the list we show the name of the effect, additional information and a <strong>-a</strong> at the end to indicate an ambient effect.</br>We also indicate the start and end time of the effect with a yellow bar at the bottom of each effect name.",
      placement: "left",
      action() {
        document.getElementById("listContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#listContainer",
      description: "<div class='tutorial-interactive'>1) Click on any effect in the list<*div>Click next when done.",
      placement: "left",
      action() {
        document.getElementById("listContainer").style.zIndex = null;
      },
    },
    {
      element: "#mainPanel",
      description: "The effect is now centered in the main panel.",
      placement: "right",
      action() {
        document.getElementById("listContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#miniView",
      description: "The 360 view also updates. Use it to find effects more easily!",
      placement: "left",
      action() {
        document.getElementById("listContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#listContainer",
      description:
      'To delete an effect. <div class="tutorial-interactive">1) Delete any effect by clicking the ❌</div>Click next when finished',
      placement: "left",
      action() {
        document.getElementById("listContainer").style.zIndex = null;
        const doneEvt = new CustomEvent("doneTutorial");
        document.dispatchEvent(doneEvt);
      },
    },
   /* {
      element: "#importButtonsDiv",
      description:
        "Por fim, caso queira importar/exportar as descrições de efeitos, pode usar esses botões abaixo.",
      placement: "left",
      action() {},
    },*/
    {
      element: "#panoPanel",
      description: "Excellent! Thank you for your participation. This concludes the tutorial. <strong></br>Close this window and return to the presentation</strong>",
      placement: "right",
      action() {},
    },
  ],
  onComplete() {
    console.log("acabou tutorial");

  },
};

const editOptionsPt = {
  backdropColor: "rgba(106, 142, 240, 0.54)",
  sequence: [
    {
      element: "#uploadButton",
      description:
        "Bem-vindo!<br> Clique em próximo para carregar um video automaticamente.<br>Por favor, tenha paciência enquanto o vídeo carrega...",
      placement: "bottom",
      action() {
        console.log("acabou primeiro passo");
        loadPanorama();
        document.getElementById("panoPanel").style.zIndex = "1001";
        // <span class="centered-text">Try it interactively!</span>
        // document.getElementById('panoPanel').style.position = 'relative';
        // document.getElementById("tooltip-helper-backdrop").style.zIndex = "1";
      },
    },
    {
      element: "#panoPanel",
      description:
        '<strong>Atenção!</strong> Esta área destacada abaixo 👇 indica tarefas interativas para você fazer<div class="tutorial-interactive"><strong>1) Gire a visualização do vídeo até localizar o homem com o lança-chamas</strong><br>- Para girar: clique e arraste</div>Clique em próximo quando terminar.',
      placement: "right",
      action() {
        document.getElementById("panoPanel").style.zIndex = null;
        // document.getElementById('panoPanel').style.position = null;
        document.getElementById("timelineConteiner").style.zIndex = "1001";
      },
    },
    {
      element: "#mainPanel",
      description:
        'Abaixo temos nossa linha do tempo. <div class="tutorial-interactive">1) Reproduza e depois pause o vídeo</br>2) Clique e arraste em qualquer lugar na linha do tempo para mover o vídeo.</div>Clique em próximo quando terminar.',
      placement: "right",
      action() {
        document.getElementById("mainPanel").style.zIndex = "1001";
        playTimeline();
        pauseTimeline();
      },
    },
    {
      element: "#mainPanel",
      description:
        'Agora vamos adicionar efeitos sensoriais. <div class="tutorial-interactive">1) Arraste o efeito de VIBRAÇÃO para acima do homem no video.</div>Clique em próximo quando terminar.',
      placement: "right",
      action() {
        if (!window.clickedInfospot) {
          alert("Efeito de vibração adicionado automaticamente");
          addSampleInfospot(0, 0);
        }
        document.getElementById("mainPanel").style.zIndex = null;
      },
    },
    {
      element: "#mainPanel",
      description:
        "Esse é um <strong>efeito local</strong>. Ele tem uma posição definida na cena, isto é, o usuário vai sentir uma vibração vinda apenas dessa posição e tamanho.",
      placement: "right",
    },
    {
      element: "#panelContainer",
      description:
        "Quando clicamos no efeito, abre uma janela para modificar as <strong>propriedades</strong> desse efeito. </br>Pode também alterá-lo para <strong>ambiente</strong>, que aplica o efeito à cena 360 inteira.",
      placement: "left",
      action() {
        document.getElementById("panelContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#panelContainer",
      description:
        'Altere o efeito. <div class="tutorial-interactive">1) Mude o tipo de efeito para <strong>aroma</strong> </br>2) defina o tipo de aroma como <strong>fumaça</strong></br>3) marque o efeito como <strong>ambiente</strong></br>4) Clique em ATUALIZAR PROPRIEDADES.</div> Clique em próximo quando terminar.',
      placement: "left",
      action() {
        document.getElementById("panelContainer").style.zIndex = null;
      },
    },
    {
      element: "#mainPanel",
      description:
        'Perceba que o efeito não possui mais a caixa roxa em volta, o que significa que ele é <strong>ambiente</strong> e será aplicado na cena toda. Para um usuário, isso significa que ele vai sentir cheiro de fumaça <strong><u>vindo de todos os lados</u></strong>.',
      placement: "right",
      action() {
        document.getElementById("panelContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#panelContainer",
      description:
        'Vamos voltar com o nosso efeito para o tipo <strong>local</strong> <div class="tutorial-interactive">1) Desmarque a opção <strong>efeito de ambiente</strong></br>2) Clique em ATUALIZAR PROPRIEDADES.</div> Clique em próximo quando terminar.',
      placement: "left",
      action() {
        document.getElementById("panelContainer").style.zIndex = null;
        document.getElementById("timelineConteiner").style.zIndex = "1001";
      },
    },
    {
      element: "#timelineConteiner",
      description:
        "Uma barra amarela aparece na linha do tempo, indicando o momento que o efeito aparece no vídeo.",
      placement: "top",
      action() {},
    },
    {
      element: "#left-handle-trim",
      description:
        "Essa barra tem indicadores de início o e fim do efeito. Eles serão chamados de <strong>keyframes</strong> do efeito. Você pode arrastá-los para alterar o momento que o efeito aparece no vídeo.",
      placement: "top",
      action() {},
    },
    {
      element: "#timelineConteiner",
      description:
        'Vamos fazer isso agora. <div class="tutorial-interactive"> <strong>1) Altere o início para 1s e o fim para 4s</strong></br> - Ajuste a duração do efeito arrastando os keyframes de início e fim.</div> Clique em próximo quando terminar.',
      placement: "top",
      action() {
        let { prevKeyframe, nextKeyframe } = getEffectBeginEndTime();
        if(prevKeyframe != 1 && nextKeyframe != 4){
          alert("Keyframe atualizado automaticamente");
          doSetEffectTime(1, 4);
        }
        playTimeline();
      },
    },
    {
      element: "#panoPanel",
      description:
        'Agora seu efeito inicia em 1s e termina em 4s. Os keyframes também salvam a posição, tamanho e intensidade do efeito em determinado ponto no tempo. A seguir, vamos modificar o tamanho do efeito de aroma no segundo 1.',
      placement: "right",
      action() {
        pauseTimeline();
      },
    },
    {
      element: "#left-handle-trim",
      description:
        'Para selecionar um keyframe para modificação. <div class="tutorial-interactive"> </strong>1) Dê um único clique no primeiro keyframe para selecioná-lo.</strong></div>Clique em próximo quando terminar.',
      placement: "top",
      action() {
        document.getElementById("timelineConteiner").style.zIndex = null;
        const res = getTrimClickedId();
        if(res == null || res.id != "left-handle-trim"){
          alert("Clicado automaticamente");
          clickStartTrim();
        }
      },
    },
    {
      element: "#propertiesButtons",
      description: "Esse conjunto de botões permite que você mude a posição e tamanho do efeito. ",
      placement: "left",
      action() {},
    },
    {
      element: "#effectSizeConteiner",
      description:
        "O tamanho padrão do efeito sensorial é de 20x20 graus.",
      placement: "left",
      action() {},
    },
    {
      element: "#intensityRangeConteiner",
      description:
        "Um valor de intensidade mais alto resulta em um efeito mais forte.",
      placement: "left",
      action() {
        document.getElementById("keyframePropertiesPanel").style.zIndex = "1001";
      },
    },
    {
      element: "#keyframePropertiesPanel",
      description:
        "Faça um exemplo. <div class='tutorial-interactive'>1) Mude a posição e o tamanho do efeito usando os botões.<br>2) Clique em ATUALIZAR KEYFRAME.</div>Clique em próximo quando terminar.",
      placement: "left",
      action() {
        document.getElementById("keyframePropertiesPanel").style.zIndex = null;
      },
    },
    {
      element: "#keyframePropertiesPanel",
      description:
        "Ótimo. Agora vamos ver como fazer animações. Vamos ilustrar isso criando um novo efeito.",
      placement: "left",
      action() {
        addSampleInfospotAnimated(3, -71);
        document.getElementById("mainPanel").style.zIndex = "1001";
        clickStartTrim();

      },
    },
    {
      element: "#panoPanel",
      description:
        "Este é um efeito de calor, no keyframe inicial (segundo 1) ele tem tamanho de 20x20 com 50% de intensidade.",
      placement: "right",
      action() {
        document.getElementById("mainPanel").style.zIndex = null;

      },
    },
    {
      element: "#right-handle-trim",
      description:
        'Agora vamos clicar no keyframe final para ver como ele está. Clique em próximo para fazer automaticamente.',
      placement: "top",
      action() {
        document.getElementById("timelineConteiner").style.zIndex = null;
        clickEndingTrim();
      },
    },
    {
      element: "#panelContainer",
      description:
        "Esse keyframe define a 100% de intensidade e tamanho de 30x30. </br>Quando temos dois keyframes com propriedades diferentes, o sistema vai fazer <strong> automaticamente uma animação</strong> do efeito. Clique em próximo para tocar o video.",
      placement: "left",
      action() {
        playTimeline();

      },
    },
    {
      element: "#panoPanel",
      description:
        "Perceba que o efeito está fazendo uma animação entre as propriedades definidas em início e fim. Isto é útil para você fazer um efeito se movimentar no ambiente. Por exemplo, seguindo o fogo.",
      placement: "right",
      action() {
        pauseTimeline();
        clickEndingTrim();
        document.getElementById("mainPanel").style.zIndex = null;
        document.getElementById("timelineConteiner").style.zIndex = "1001";
      },
    },
    {
      element: "#timelineConteiner",
      description:
        'Você também pode adicionar novos <strong>keyframes</strong> no meio do efeito. Vamos criar um novo agora. <div class="tutorial-interactive">1) Dê um duplo clique em 2s na linha do tempo.<br>2) Certifique-se de que o keyframe fique amarelo; clique novamente se necessário.</div>Clique em próximo quando terminar.',
      placement: "top",
      action() {
        document.getElementById("timelineConteiner").style.zIndex = null;
        document.getElementById("panelContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#mainPanel",
      description:
        'Agora edite as propriedades desse keyframe:<div class="tutorial-interactive">1) Ajuste o efeito para uma nova posição usando as setas no painel a direita.<br>2) Clique em ATUALIZAR keyframe após as mudanças.</div>Clique em próximo quando terminar.',
      placement: "left",
      action() {
        playTimeline();
        document.getElementById("panelContainer").style.zIndex = null;
      },
    },
    {
      element: "#panoPanel",
      description: "Ótimo! Você criou um efeito mais complexo. Vamos recapitular: </br>- Um efeito tem pelo menos dois keyframes(início e fim).</br>-Cada keyframe clicado permite alterar propriedades do efeito naquele momento</br>-Se alterarmos um keyframe e tocarmos o video, veremos que o sistema fez uma animação entre as propriedades.",
      placement: "right",
      action() {
        pauseTimeline();
        clickEndingTrim();

      },
    },
    {
      element: "#panelContainer",
      description:
        "No topo desse painel você verá dois botões, Copiar e Deletar. Vamos enterder mais sobre eles.",
      placement: "left",
      action() {
      },
    },
    {
      element: "#delete-keyframe",
      description:
        "O Deletar quando clicado remove o keyframe atual. Note que keyframes de início e fim nao pode ser deletados.",
      placement: "left",
      action() {
        document.getElementById("copy-keyframe").click();
      },
    },
    {
      element: "#copy-keyframe",
      description:
        "O Copiar faz você pode substituir o valor do keyframe atual pelo imediatamente anterior a ele na timeline. </br> Clique em próximo para fazer automaticamente.",
      placement: "left",
      action() {
        document.getElementById("copy-keyframe").click();
        playTimeline();

      },
    },

    {
      element: "#mainPanel",
      description:
        "Agora as propriedades do keyframe do final foram trocados pelas do keyframe que criou em 2s. Isso é útil caso você queira que um efeito fique parado (sem animação) por um espaço de tempo maior. ",
      placement: "left",
      action() {
        pauseTimeline();
      },
    },
    {
      element: "#infospotListPanel",
      description: "Neste painel, você verá todos os efeitos na cena.",
      placement: "left",
      action(){
        addSampleInfospotAmbient(15,15);
      }
    },
    {
      element: "#listContainer",
      description: "Na lista mostramos o nome do efeito, infos adicionais e um <strong>-a</strong> ao final para indicar um efeito ambiente.</br>Também indicamos o momento de início e fim do efeito por uma barra amarela em baixo de cada nome de efeito.",
      placement: "left",
      action() {
        document.getElementById("listContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#listContainer",
      description: "<div class='tutorial-interactive'>1) Clique em qualquer um efeito na lista<div>Clique em próximo quando terminar.",
      placement: "left",
      action() {
        document.getElementById("listContainer").style.zIndex = null;
      },
    },
    {
      element: "#mainPanel",
      description: "O efeito agora está centralizado no painel principal.",
      placement: "right",
      action() {
        document.getElementById("listContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#miniView",
      description: "A visão 360 também atualiza. Use ela para achar os efeitos mais facilmente!",
      placement: "left",
      action() {
        document.getElementById("listContainer").style.zIndex = "1001";
      },
    },
    {
      element: "#listContainer",
      description:
        'Para excluir um efeito. <div class="tutorial-interactive">1) Exclua qualquer efeito clicando no ❌</div>Clique em próximo quando terminar.',
      placement: "left",
      action() {
        document.getElementById("listContainer").style.zIndex = null;
        const doneEvt = new CustomEvent("doneTutorial");
        document.dispatchEvent(doneEvt);
      },
    },
   /* {
      element: "#importButtonsDiv",
      description:
        "Por fim, caso queira importar/exportar as descrições de efeitos, pode usar esses botões abaixo.",
      placement: "left",
      action() {},
    },*/
    {
      element: "#panoPanel",
      description: "Excelente! Obrigado por sua participação. Isso conclui o tutorial. <strong></br>Feche essa janela e volte para a apresentação </strong>",
      placement: "right",
      action() {},
    },
  ],
  onComplete() {
    console.log("acabou tutorial");

  },
};

const autoextractOptionsEn = {
  backdropColor: "rgba(106, 142, 150, 0.54)",
  sequence: [
    {
      element: "#panoPanel",
      description:
      'Welcome to the automatic sensory effects extraction tutorial.',
      placement: "right",
      action() {
        loadPanorama("pizza.mp4");
      },
    },
    {
      element: "#activateAutoExtract",
      description:
      'To start the process you must click on this button. Click next to click automatically.',
      placement: "left",
      action() {
        clickAutoExtractBtn();
      },
    },
    {
      element: "#autoExtractPanel",
      description:
      'We can select which AI modules will analyze our video.</br>Each module excels in detecting different elements in the video. </br>I will select some for you. Just click "Next" to continue.',
      placement: "left",
      action() {
        enableAllModules();
      },
    },
    {
      element: "#effectLocalizationCheck",
      description:
      "Object localization finds common objects like 'car', 'person', 'tree' and allows you to generate sensory effects wherever they are in the video.",
      placement: "left",
      action() {},
    },
    {
      element: "#sceneUnderstandingCheck",
      description:
      "The ambient description interprets the entire scene, identifying general concepts such as 'adventure', 'love', 'action'. It also recognizes objects but cannot locate them. In other words, it can only generate <strong> ambient effects </strong>.",
      placement: "left",
      action() {},
    },
    {
      element: "#beginAutoExtractBtn",
      description:
      "After selecting the modules, we click this button to start the recognition. </br>Click next to do it automatically.",
      placement: "left",
      action() {
        clickAutoExtractBeginBtn();
        //document.getElementById("tooltip-helper-end-sequence").style.visibility = "hidden";
        document.getElementById("tooltip-helper-next-sequence").style.visibility = "hidden";
        setTimeout(() => {
          document.getElementById("tooltip-helper-next-sequence").click();
          // document.getElementById('tooltip-helper-next-sequence').style.visibility = 'visible'
          // document.getElementById('tooltip-helper-end-sequence').style.visibility = 'visible'
        }, 7000);
      },
    },
    {
      element: "#mainPanel",
      description:
      "Your video will be analyzed by the modules. This process may take some time...",
      placement: "right",
      action() {
        function f() {
          document.getElementById("tooltip-helper-next-sequence").style.visibility = "visible";
          //document.getElementById("tooltip-helper-end-sequence").style.visibility = "visible";
          document.removeEventListener("doneModules", f);
        }
        document.addEventListener("doneModules", f);
      },
    },
    {
      element: "#body-modal-loading-modules",
      description:
      "Be patient; it may take a few minutes. </br> Once complete, another window will show the identified elements. When it appears, click next.",
      placement: "top",
      action() {},
    },
    {
      element: "#effectLocalizationResult",
      description:
      "This window shows the elements recognized by the modules.</br>Here we see that 'Person' appears 45x in 6 seconds, indicating that there are several people in each second of the scene.",
      placement: "right",
      action() {},
    },
    {
      element: "#effectLocalizationResult",
      description:
      "We see that the label 'Food' was found. With this we can define that every time 'Food' appears, a pizza aroma effect will be generated.",
      placement: "right",
      action() {},
    },
    {
      element: "#sceneUnderstandingResult",
      description:
      "Our ambient description also found some elements. Remember that it only generates ambient effects.</br>Click next to close this window.",
      placement: "right",
      action() {
        closeAutoExtractResponseModal();
      },
    },
    {
      element: "#autoExtractResultsPanel",
      description:
      "This panel allows you to associate the <strong>elements</strong> that each module found with the sensory effects to activate.",
      placement: "left",
      action() {
        document.getElementById("effectLocalization").getElementsByTagName("input")[0].checked = true;
      },
    },
    {
      element: "#autoExtractResultsPanel",
      description:
      "When you click on the module name, it opens several forms, known as <strong>associations</strong> between element and sensory effect.</br>Click next to see an example",
      placement: "left",
      action() {
        let parentElement = document.querySelector("#form-control-labels-localization > div > div:nth-child(1) > div > div:nth-child(1) > select.select.select-bordered.select-xs.flex-grow.max-w-xs.mr-2");
        let options = Array.from(parentElement.options);
        let index = options.findIndex(option => option.value === "Food");
        parentElement.selectedIndex = index;
        document.querySelector(
          "#form-control-labels-localization > div > div > div > div:nth-child(1) > select.select.select-success.select-xs.flex-grow.max-w-xs.ml-2"
        ).selectedIndex = 5;
        document
          .querySelector("#form-control-labels-localization > div > div > div > div:nth-child(2)")
          .classList.remove("hidden");
        document.querySelector("#form-control-labels-localization > div > div > div > div:nth-child(2) > input").value =
          "pizza";
        document.querySelector("#form-control-labels-localization > div > div > div > input:nth-child(5)").value = 50;


      },

    },
    {
      element: "#effectLocalizationDiv",
      description:
      'As an example, it was set whenever "Food" appears, a "pizza" aroma effect with 50% intensity will be created.',
      placement: "left",
      action() {
      },
    },
    {
      element: "#tutorialAddEffectSelector",
      description:
      '<strong>Each time you click this button it will generate new effects according to the form.</strong></br> Click next to do it automatically',
      placement: "left",
      action() {
        document.getElementById("tutorialAddEffectSelector").click();

      },
    },
    {
      element: "#listContainer",
      description:
        'New effects were added!',
      placement: "left",
      action() {
        document.getElementById("effectLocalizationDiv").style.zIndex = "1001";
      },
    },
    {
      element: "#effectLocalizationDiv",
      description:
      'Now it is your turn. Edit the form <div class="tutorial-interactive">1) Set wherever "Drink" appears, we want to create an "aroma" effect with the type "beer" at 25% intensity.</br>2) Click in Add effect</div> Click next when finished.',
      placement: "left",
      action() {
        document.getElementById("effectLocalizationDiv").style.zIndex = null;
        document.getElementById("mainPanel").style.zIndex = "1001";

      },
    },
    {
      element: "#mainPanel",
      description:
      'The effects have been generated! <div class="tutorial-interactive">Explore the video to see the result</div>Click next when finished.',
      placement: "right",
      action() {
        document.getElementById("mainPanel").style.zIndex = null;

      },
    },
    {
      element: "#makeAssociation",
      description:
      'After finishing the associations, you need to click this button to finish the automatic extraction.</br> Click next to do it automatically.',
      placement: "left",
      action() {
        document.getElementById("makeAssociation").click();
      },
    },
    {
      element: "#delete-all-effects",
      description:
      'Finally, two tips:</br>- If you want to make associations again, just click the "Automatic extraction" button again. The system will remember the previous analysis.</br>- If you want to clear the scene, you can click the "Clear" button next to the effects list. ',
      placement: "left",
      action() {
        const doneEvt = new CustomEvent("doneTutorial");
        document.dispatchEvent(doneEvt);
      },
    },
    {
      element: "#mainPanel",
      description:
      'Thank you for your participation. This concludes the tutorial.<strong></br>Close this window and return to the presentation</strong>',
      placement: "right",
      action() {},
    },
  ],
  onComplete() {
    console.log("acabou");
    document.getElementById("mainPanel").style.zIndex = null;


  },
};

const autoextractOptionsPt = {
  backdropColor: "rgba(106, 142, 150, 0.54)",
  sequence: [
    {
      element: "#panoPanel",
      description:
        'Bem-vindo ao tutorial de extração automática de efeitos sensoriais.',
      placement: "right",
      action() {
        loadPanorama("pizza.mp4");
      },
    },
    {
      element: "#activateAutoExtract",
      description:
        'Para iniciar o processo deve-se clicar nesse botão. Clique em próximo para clicar automaticamente.',
      placement: "left",
      action() {
        clickAutoExtractBtn();
      },
    },
    {
      element: "#autoExtractPanel",
      description:
        'Podemos selecionar quais módulos de IA vão analisar nosso vídeo.</br>Cada módulo se destaca na detecção de diferentes elementos no vídeo. </br>Vou selecionar alguns para você. Basta clicar em "Próximo" para continuar.',
      placement: "left",
      action() {
        enableAllModules();
      },
    },
    {
      element: "#effectLocalizationCheck",
      description:
        "A localização de objetos encontra objetos comuns, como 'carro', 'pessoa', 'árvore' e permite gerar efeitos sensoriais onde eles estiverem no vídeo.",
      placement: "left",
      action() {},
    },
    {
      element: "#sceneUnderstandingCheck",
      description:
        "A descrição de ambiente interpreta toda a cena, identificando conceitos gerais tal como 'aventura', 'amor', 'ação'. Ela também reconhece objetos mas não consegue localizar eles. Ou seja, só consegue gerar <strong> efeitos de ambiente</strong>.",
      placement: "left",
      action() {},
    },
    {
      element: "#beginAutoExtractBtn",
      description:
        "Após selecionar os módulos, clicamos neste botão para iniciar o reconhecimento. </br>Clique em próximo para fazer automaticamente.",
      placement: "left",
      action() {
        clickAutoExtractBeginBtn();
        //document.getElementById("tooltip-helper-end-sequence").style.visibility = "hidden";
        document.getElementById("tooltip-helper-next-sequence").style.visibility = "hidden";
        setTimeout(() => {
          document.getElementById("tooltip-helper-next-sequence").click();
          // document.getElementById('tooltip-helper-next-sequence').style.visibility = 'visible'
          // document.getElementById('tooltip-helper-end-sequence').style.visibility = 'visible'
        }, 7000);
      },
    },
    {
      element: "#mainPanel",
      description:
        "Seu vídeo será analisado pelos módulos. Esse processo pode levar um tempo...",
      placement: "right",
      action() {
        function f() {
          document.getElementById("tooltip-helper-next-sequence").style.visibility = "visible";
          //document.getElementById("tooltip-helper-end-sequence").style.visibility = "visible";
          document.removeEventListener("doneModules", f);
        }
        document.addEventListener("doneModules", f);
      },
    },
    {
      element: "#body-modal-loading-modules",
      description:
        "Tenha paciência; pode levar alguns minutos. </br> Após a conclusão, outra janela mostrará os elementos identificados. Quando ela aparecer, clique em próximo.",
      placement: "top",
      action() {},
    },
    {
      element: "#effectLocalizationResult",
      description:
        "Essa janela mostra os elementos reconhecidos pelos módulos.</br>Aqui vemos que 'Person' aparece 45x em 6 segundos, indicando que tem várias pessoas em cada segundo da cena.",
      placement: "right",
      action() {},
    },
    {
      element: "#effectLocalizationResult",
      description:
        "Vemos que 'Food' foi encontrado. Com isso podemos definir que toda vez que 'Food' aparecer, será gerado um efeito de aroma de pizza.",
      placement: "right",
      action() {},
    },
    {
      element: "#sceneUnderstandingResult",
      description:
        "Nossa descrição de ambiente também encontrou alguns elementos. Lembre que ele só gera efeitos de ambiente.</br>Clique em próximo para fechar essa janela.",
      placement: "right",
      action() {
        closeAutoExtractResponseModal();
      },
    },
    {
      element: "#autoExtractResultsPanel",
      description:
        "Este painel permite associar os <strong>elementos</strong> que cada módulo encontrou com os efeitos sensoriais para ativar.",
      placement: "left",
      action() {
        document.getElementById("effectLocalization").getElementsByTagName("input")[0].checked = true;
      },
    },
    {
      element: "#autoExtractResultsPanel",
      description:
        "Ao clicar no nome do módulo, ele abre vários formulários, conhecidos como <strong>associações</strong> entre elemento e efeito sensorial.</br>Clique em próximo para ver um exemplo",
      placement: "left",
      action() {
        let parentElement = document.querySelector("#form-control-labels-localization > div > div:nth-child(1) > div > div:nth-child(1) > select.select.select-bordered.select-xs.flex-grow.max-w-xs.mr-2");
        let options = Array.from(parentElement.options);
        let index = options.findIndex(option => option.value === "Food");
        parentElement.selectedIndex = index;
        document.querySelector(
          "#form-control-labels-localization > div > div > div > div:nth-child(1) > select.select.select-success.select-xs.flex-grow.max-w-xs.ml-2"
        ).selectedIndex = 5;
        document
          .querySelector("#form-control-labels-localization > div > div > div > div:nth-child(2)")
          .classList.remove("hidden");
        document.querySelector("#form-control-labels-localization > div > div > div > div:nth-child(2) > input").value =
          "pizza";
        document.querySelector("#form-control-labels-localization > div > div > div > input:nth-child(5)").value = 50;


      },

    },
    {
      element: "#effectLocalizationDiv",
      description:
        'Como exemplo, foi definido sempre que "Food" aparecer, será criado um efeito de aroma de "pizza" com 50% de intensidade.',
      placement: "left",
      action() {
      },
    },
    {
      element: "#tutorialAddEffectSelector",
      description:
        '<strong>Cada vez que clicar nesse botão vai gerar novos efeitos de acordo com o formulário.</strong></br> Clique em próximo para fazer automaticamente',
      placement: "left",
      action() {
        document.getElementById("tutorialAddEffectSelector").click();

      },
    },
    {
      element: "#listContainer",
      description:
        'Novos efeitos foram adicionados',
      placement: "left",
      action() {
        document.getElementById("effectLocalizationDiv").style.zIndex = "1001";
      },
    },
    {
      element: "#effectLocalizationDiv",
      description:
        'Agora é sua vez. Edite o formulário <div class="tutorial-interactive">1) Defina sempre que "Drink" aparecer, queremos criar um efeito de "aroma" com o tipo "cerveja" com 25% de intensidade.</br>2) Clique em Adicionar efeito</div> Clique em próximo quando finalizar.',
      placement: "left",
      action() {
        document.getElementById("effectLocalizationDiv").style.zIndex = null;
        document.getElementById("mainPanel").style.zIndex = "1001";

      },
    },
    {
      element: "#mainPanel",
      description:
        'Os efeitos foram gerados! <div class="tutorial-interactive">Explore o vídeo para ver o resultado</div>Clique em próximo quando terminar.',
      placement: "right",
      action() {
        document.getElementById("mainPanel").style.zIndex = null;

      },
    },
    {
      element: "#makeAssociation",
      description:
        'Depois de terminar as associações é necesssário clicar nesse botão para finalizar a extração automática.</br> Clique em próximo para fazer automaticamente.',
      placement: "left",
      action() {
        document.getElementById("makeAssociation").click();
      },
    },
    {
      element: "#delete-all-effects",
      description:
        'Por fim, duas dicas:</br>- Se quiser fazer associações novamente, basta clicar no botão "Extração automática" denovo. O sistema lembrará da análise anterior.</br>- Caso queira limpar a cena pode clicar no botão "Clear" ao lado da lista de efeitos.  ',
      placement: "left",
      action() {
        const doneEvt = new CustomEvent("doneTutorial");
        document.dispatchEvent(doneEvt);
      },
    },
    {
      element: "#mainPanel",
      description:
        'Obrigado por sua participação. Isso conclui o tutorial.<strong></br>Feche essa janela e volte para a apresentação </strong>',
      placement: "right",
      action() {},
    },
  ],
  onComplete() {
    console.log("acabou");
    document.getElementById("mainPanel").style.zIndex = null;


  },
};

const createSequenceEditEn = function () {
  createSequence(editOptionsEn);
};
const createSequenceAutoExtractEn = function () {
  createSequence(autoextractOptionsEn);
};

const createSequenceEditPt = function () {
  createSequence(editOptionsPt);
};
const createSequenceAutoExtractPt = function () {
  createSequence(autoextractOptionsPt);
};
export { createSequenceEditEn, createSequenceAutoExtractEn, createSequenceEditPt, createSequenceAutoExtractPt };
