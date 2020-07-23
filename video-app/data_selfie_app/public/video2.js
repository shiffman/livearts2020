const button = document.getElementById('record');
chunks = [];
let video;

function setup() {
  // noCanvas();
  let canvas = createCanvas(500, 500);
  canvas.parent('hold');
  const video = createCapture(VIDEO);
  video.size(500, 500);
  // video.hide();
  document.getElementsByTagName("video")[0].setAttribute("id", "stream");

  // button.addEventListener('click', async event => {

  //   //record the video instead of image snapshot
  //   video.loadPixels();
  //   const image64 = video.canvas.toDataURL();

  //   // instead of image64, send the video blob
  //   const data = { lat, lon, mood, image64 };
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   };
  //   const response = await fetch('/api', options);
  //   const json = await response.json();
  //   console.log(json);
  // });
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  background(0);
  image(video, 0, 0, width, height);

}

function record() {
  chunks.length = 0;
  let stream = document.querySelector('canvas').captureStream(30),

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


// add videos to webpage
// getData();

// async function getData() {
//   const response = await fetch('/api');
//   const data = await response.json();

//   for (item of data) {
//     const image = document.createElement('img');

//     // mood.textContent = `mood: ${item.mood}`;
//     // geo.textContent = `${item.lat}°, ${item.lon}°`;
//     const dateString = new Date(item.timestamp).toLocaleString();
//     date.textContent = dateString;
//     image.src = item.image64;
//     image.alt = 'A submission';

//     root.append(date, image);
//     document.body.append(root);
//   }
//   console.log(data);
// }


//   let recordedBlob = new Blob(recordedChunks, { type: "video/webm"} );
//   recording.src = URL.createObjectURL(recordedBlob);
