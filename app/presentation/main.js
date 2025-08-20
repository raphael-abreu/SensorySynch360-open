var lang = document.getElementById("helper").getAttribute("data-lang");


window.mobileCheck = function () {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
if (mobileCheck() == true)
  if (lang == "pt")
    alert("Parece que você está no celular. Será mais difícil fazer o teste");
  else
    alert("It looks like you are on your cell phone. It will be more difficult to take the test");

var videos = document.querySelectorAll('video');


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

videos.forEach(function (video) {
  video.addEventListener('ended', function () {
    Reveal.next();
  });
});


function toggleAudio(video) {
  if (video.muted) {
    video.muted = false;
    iconElement.innerText = '🔊'; // Change icon to speaker
  } else {
    video.muted = true;
    iconElement.innerText = '🔇'; // Change icon to mute
  }
}

// Function to toggle audio for all videos on the page
function toggleAllAudio() {
  var videos = document.querySelectorAll('video');
  videos.forEach(function (video) {
    toggleAudio(video, video.muteIcon);
  });
}

function createMuteIcon() {
  var icon = document.createElement('div');
  icon.className = 'mute-icon';
  icon.innerText = '🔊'; // Initial state is unmuted
  document.body.appendChild(icon);

  icon.addEventListener('click', function () {
    toggleAllAudio();
  });
  iconElement = icon;
}

// Call initializeMuteIcons to set up mute icons when the page loads
document.addEventListener('DOMContentLoaded', createMuteIcon);
function tasksToShow(num, lang) {
  let testGroup = (num % 4) + 1;
  let descpt = {
    "v1m": "Analise o conteúdo do vídeo e marque efeitos ambientes de aroma de árvore e locais de calor vindo do sol",
    "v2m": "Analise o conteúdo do vídeo e marque efeitos locais de calor de onde estiver vindo fogo e sol. Lembre-se de usar keyframes.",
    "v3m": "Analise o conteúdo do vídeo e marque efeitos locais de aroma de pizza e de cerveja. Lembre-se de usar keyframes.",
    "v4m": "Analise o conteúdo do vídeo e marque efeitos ambientes de frio e vento. Marque efeitos locais de calor vindo do sol e fogo",
    "v1a": "Usando a extração automática, use os módulos de descrição de ambiente e de localização de sol para marcar efeitos ambientes de aroma de árvore e locais de calor. Depois, corrija efeitos ou adicione manualmente se necessário.",
    "v2a": "Usando a extração automática, utilize o módulo de localização de fogo para marcar efeitos locais de calor.  Depois, corrija efeitos ou adicione manualmente se necessário.",
    "v3a": "Usando a extração automática, utilize o módulo de localização de objetos para marcar efeitos locais de aroma de pizza e de cerveja. Depois, corrija efeitos ou adicione manualmente se necessário.",
    "v4a": "Usando a extração automática, utilize o módulos de descrição de ambiente, localização de sol e localização de fogo para marcar efeitos ambientes de frio e vento e efeitos locais de calor.  Depois, corrija efeitos ou adicione manualmente se necessário.",
  };
  let descen = {
    "v1m": "Analyze the video content and mark ambient effects of tree aroma and heat locations coming from the sun",
    "v2m": "Analyze the video content and mark local heat effects from where fire and sun are coming from. Remember to use keyframes.",
    "v3m": "Analyze the video content and mark local aroma effects of pizza and beer. Remember to use keyframes.",
    "v4m": "Analyze the video content and mark ambient effects of cold and wind. Mark local heat effects coming from the sun and fire",
    "v1a": "Using automatic extraction, use the ambient description and sun location modules to mark ambient effects of tree aroma and local heat effect. Then, correct effects or add manually if necessary.",
    "v2a": "Using automatic extraction, use the fire location module to mark local heat effects. Then, correct effects or add manually if necessary.",
    "v3a": "Using automatic extraction, use the object location module to mark local aroma effects of pizza and beer. Then, correct effects or add manually if necessary.",
    "v4a": "Using automatic extraction, use the ambient description, sun location and fire location modules to mark ambient effects of cold and wind and local heat effects. Then, correct effects or add manually if necessary."
  };

  let tasks = {
    1: [
      { filename: 'v1.mp4', "title": { "pt": descpt["v1m"], "en": descen["v1m"] } },
      { filename: 'v2.mp4', "title": { "pt": descpt["v2a"], "en": descen["v2a"] } },
      //{ filename: 'v3.mp4', "title": { "pt": descpt["v3a"], "en": descen["v3a"] } },
      //{ filename: 'v4.mp4', "title": { "pt": descpt["v4a"], "en": descen["v4a"] } }
    ],
    2: [
      { filename: 'v2.mp4', "title": { "pt": descpt["v2m"], "en": descen["v2m"] } },
      { filename: 'v3.mp4', "title": { "pt": descpt["v3a"], "en": descen["v3a"] } },
      //{ filename: 'v4.mp4', "title": { "pt": descpt["v4a"], "en": descen["v4a"] } },
      //{ filename: 'v1.mp4', "title": { "pt": descpt["v1a"], "en": descen["v1a"] } }
    ],
    3: [
      { filename: 'v3.mp4', "title": { "pt": descpt["v3m"], "en": descen["v3m"] } },
      { filename: 'v4.mp4', "title": { "pt": descpt["v4a"], "en": descen["v4a"] } },
      //{ filename: 'v1.mp4', "title": { "pt": descpt["v1a"], "en": descen["v1a"] } },
      //{ filename: 'v2.mp4', "title": { "pt": descpt["v2a"], "en": descen["v2a"] } }
    ],
    4: [
      { filename: 'v4.mp4', "title": { "pt": descpt["v4m"], "en": descen["v4m"] } },
      { filename: 'v1.mp4', "title": { "pt": descpt["v1a"], "en": descen["v1a"] } },
      //{ filename: 'v2.mp4', "title": { "pt": descpt["v2a"], "en": descen["v2a"] } },
      //{ filename: 'v3.mp4', "title": { "pt": descpt["v3a"], "en": descen["v3a"] } }
    ]
  };
  for (let index = 0; index < 2; index++) {
    tasks[testGroup][index]["url"] = `../editor?testUserID=${num}`;
    tasks[testGroup][index]["url"] += `&testGroup=${testGroup}&task=${index + 1}`;
    tasks[testGroup][index]["url"] += `&testType=${index < 1 ? 'm' : 'a'}`;
    tasks[testGroup][index]["url"] += `&mediaName=${tasks[testGroup][index].filename}`;
    tasks[testGroup][index]["url"] += `&userLanguage=${lang}`;
    tasks[testGroup][index]["url"] += `&taskDescription=${tasks[testGroup][index].title[lang]}`;
  }
  return tasks[testGroup];
}

const sheetID = '1KIcuNOktM1HSkkA6Og0LAGY0AWwzxHOgSMpvGv0IoKw';
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
const sheetName = 'Sheet1';
let qu = 'Select *';
const query = encodeURIComponent(qu);
const url = `${base}&sheet=${sheetName}&tq=${query}`;
const data = [];
//document.addEventListener('DOMContentLoaded', init);
var started = false;

function init() {
  started = true;
  console.log('ready');
  fetch(url)
    .then(res => res.text())
    .then(rep => {
      const jsData = JSON.parse(rep.substr(47).slice(0, -2));
      console.log(jsData)
      // Get the last row
      const lastRow = jsData.table.rows[jsData.table.rows.length - 1];
      // Get values from the last row
      const lastUserID = lastRow.c[0].v; // userID
      //const startedTestAt = lastRow.c[1].v; // startedTestAt

      console.log("Last UserID:", lastUserID);
      //console.log("Started Test At:", startedTestAt);

      let savedUid = getRandomInt(50000);
      if (savedUid % 4 === lastUserID % 4) 
        savedUid = (savedUid + 1);
      
      const currTime = new Date().toUTCString();
      Array.from(document.getElementsByClassName("yourID")).forEach(
        element => element.innerText = savedUid);

      document.getElementById("initTime").innerText = currTime;

      document.getElementById('tutorial-1').href = `../editor?tutorial=edit&tutorialUserID=${savedUid}&userLanguage=${lang}`;
      document.getElementById('tutorial-2').href = `../editor?tutorial=autoextract&tutorialUserID=${savedUid}&userLanguage=${lang}`;
      if (lang == "pt") {
        document.getElementById('quest-0').href = `https://docs.google.com/forms/d/e/1FAIpQLSfd86_JTJ8f1LuaaJ91cPtW0eYsnQLA4iI5tnfQVafXdgH1xQ/viewform?usp=pp_url&entry.1907088896=${savedUid}`;
        document.getElementById('quest-1').href = `https://docs.google.com/forms/d/e/1FAIpQLSeGWsYtJb4J5g6cK83q30TZKjqS8AxTTZRc3kPGQ1tzyk7xKA/viewform?usp=pp_url&entry.1907088896=${savedUid}`;
        document.getElementById('quest-2').href = `https://docs.google.com/forms/d/e/1FAIpQLSdSBmVfsVv4mD8tmX0GzTlMvuYkFWlquX-AmoMT8KDuBAZhdg/viewform?usp=pp_url&entry.1907088896=${savedUid}`;
      } else if (lang == "en") {
        //TODO: 
        document.getElementById('quest-0').href = `https://docs.google.com/forms/d/e/1FAIpQLScUQcdgfJS4xY4Ucz0fJy4RhGSqRBhRYt12r5lb3hN0GAjLYA/viewform?usp=pp_url&entry.1907088896=${savedUid}`;
        document.getElementById('quest-1').href = `https://docs.google.com/forms/d/e/1FAIpQLSfK3_AyRx0yXLrSIdqhh2Uhtsh-ep6hXN5cNWddSY2sF1QYIQ/viewform?usp=pp_url&entry.1907088896=${savedUid}`;
        document.getElementById('quest-2').href = `https://docs.google.com/forms/d/e/1FAIpQLSdx-FkJKgP_m1aGdZVBLT84HcMnhTK7FSOT7MxsdoYDI444Bg/viewform?usp=pp_url&entry.1907088896=${savedUid}`;
      } else {
        alert("Not implemented");
        return;
      }

      let tasks = tasksToShow(savedUid, lang);

      let task1Els = document.querySelectorAll('[data-task="task1"]');
      let task2Els = document.querySelectorAll('[data-task="task2"]');
      //let task3Els = document.querySelectorAll('[data-task="task3"]');
      //let task4Els = document.querySelectorAll('[data-task="task4"]');
      // 0 is the span and 1 is the button
      task1Els[0].innerText = tasks[0].title[lang];
      task1Els[1].href = tasks[0].url;
      task2Els[0].innerText = tasks[1].title[lang];
      task2Els[1].href = tasks[1].url;
      //task3Els[0].innerText = tasks[2].title[lang];
      //task3Els[1].href = tasks[2].url;
      //task4Els[0].innerText = tasks[3].title[lang];
      //task4Els[1].href = tasks[3].url;


      // upload to the sheet
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzoajbTTKyeoa8oo-8iQfONUkVjPeVpeF_ZGPuhZK2EhDUv_4WBacp6oEcLmb2PaXTE/exec'
      const formData = new FormData();
      formData.append('userID', savedUid);
      formData.append('startedTestAt', currTime);
      formData.append('lang', lang);

      fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => console.log('Success!', response))
        .catch(error => {
          console.error('Error!', error.message);
          if (lang == "pt")
            alert("Ocorreu um erro por favor, atualize a página e tente novamente.");
          else
            alert("An error occurred, please refresh the page and try again.");
        })
    }).catch(error => {
      console.error('Error!', error.message);
      if (lang == "pt")
        alert("Ocorreu um erro por favor, atualize a página e tente novamente.");
      else
        alert("An error occurred, please refresh the page and try again.");
    })


}

Reveal.initialize({
  width: 1080,
  autoAnimateEasing: 'ease-out',
  autoAnimateDuration: 0.8,
  autoAnimateUnmatched: false,
  pdfMaxPagesPerSlide: 1,
  pdfSeparateFragments: false,
  controls: true,
  progress: true,
  history: true,
  center: true,
  margin: 0,
  help: true, // Show help overlay when ? is pressed
  transition: 'none', // default / none / slide / concave / convex / zoom
  transitionSpeed: 'default', // default / fast / slow
  backgroundTransition: 'default', // default / none / fade / slide / convex / concave/ zoom
});


Reveal.addEventListener('begin', function () {
  document.getElementById("firstVideo").play();
})

Reveal.addEventListener('tcle', function () {
  let checked = document.getElementById('checkTcle').checked;
  if (!checked) {
    if (lang == "pt")
      alert("Para iniciar o teste voce deve aceitar os termos.");
    else
      alert("To start the test you must accept the terms.");
    Reveal.left();
  } else {
    if (!started) init();
  }
});
