navigator.getUserMedia = 
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia;

const modelParams = {
  flipHorizontal: true,
  imageScaleFactor: 0.7,
  maxNumBoxes: 20,
  iouThreshold: 0.5,
  scoreThreshold: 0.79,

}

const video = document.querySelector('#video');
const audio = document.querySelector("#audio");
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

let model;

handTrack.startVideo(video)
  .then(status => {
    if(status){
      navigator.getUserMedia({video:{}}, stream =>{
        video.srcObject = stream;
        setInterval(runDetection, 300);
      }, 
      err => console.log(err))
    }
  });


function runDetection(){
  model.detect(video)
    .then(predictions => {
      console.log(predictions[0]);
      model.renderPredictions(predictions, canvas, context, video);
      const obj = findHand(predictions);
      if(obj!==null){
        const bbox = obj.bbox;
        let x = Number(bbox[0]);
        let y = Number(bbox[1]);
        console.log("Hand Position: ", x, y);
        //Play the Music
        playDrums(x,y);
      }
      
    });
}

handTrack.load(modelParams)
  .then(lmodel => {
    model = lmodel;
  });

function findHand(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key].label === "closed"|| obj[key].label === "open") {
                return obj[key];
            }
        }
    }
    return null;
}

function playDrums(x, y){
  //360, 200 for Bass
  //360, <200 for Snare
  //<360, <200 for Hi Hat
  // <360 >200 for Metronome
  console.log("PLAYING ",x,y, "HI HAT");
  if(x>=360){
    if(y>=200){
      audio.src = "/drums/BassDrum.mp3";
    }
    else{
      audio.src = "/drums/Snare.mp3";
    }
  }
  if(x<=60){
    if(y>=200){
      audio.src = "/drums/Snare.mp3";
    }
  }
  else{
    audio.src="/drums/hiHat.mp3";
  }
  audio.play();
}