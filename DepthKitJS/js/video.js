var video = document.getElementById('video');
var texture = new THREE.VideoTexture(video);
texture.needsUpdate;
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.format = THREE.RGBFormat;
texture.crossOrigin = 'anonymous';

var imageObject = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map: texture }),);

scene.add( imageObject );

video.src = "./livearts2020/DepthKitJS/files/sample-video1.mov";
video.load();
video.play();