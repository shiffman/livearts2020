// display video
let capture;
const button = document.getElementById('record');
chunks = [];

function setup() {
  let canvas = createCanvas(640, 480);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
}

function draw() {
  translate(capture.width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
}


// record video
function record() {
  chunks.length = 0;
  // let stream = document.querySelector('canvas').captureStream(30),
  let stream = capture.elt.srcObject.captureStream(30),

    // i can't seem to get it to record the actual video html element
    // let stream = document.querySelector('#stream').captureStream(30),
    // let stream = document.getElementById('stream').captureStream(30),
    recorder = new MediaRecorder(stream);

  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
  button.onclick = e => {
    recorder.stop();
    button.textContent = 'start recording';
    button.onclick = record;
  };
  recorder.start();
  button.textContent = 'stop recording';
}

// display video recording on webpage
function exportVideo(e) {
  var blob = new Blob(chunks);
  var vid = document.createElement('video');
  vid.id = 'recorded'
  vid.controls = true;
  vid.src = URL.createObjectURL(blob);
  document.body.appendChild(vid);
  vid.play();
}
button.onclick = record;
