w = 1920;
h = 1080;
V.width = w;
V.height = h;
let soundBuffer;
C.fillText("click here to start", w / 2, h / 2);
function draw(time) {
    C.clearRect(0, 0, w, h);
    for (let i = 0; i < 192; i++) {
        for (let j = 0; j < 108; j++) {
          C.fillStyle = `rgb(
              ${Math.floor(255 - 1.33 * i)},
              ${Math.floor(255 - 2.36 * j)},
              ${255 * (Math.sin(time / 100) + 1) / 2.0}`;
          C.fillRect(j * 25, i * 25, 25, 25);
        }
    }
    const nowBuffering = soundBuffer.getChannelData(0);
    for (let i = 0; i < soundBuffer.length; i++) {
        // Math.random() is in [0; 1.0]
        // audio needs to be in [-1.0; 1.0]
        const ti = time + i;
        nowBuffering[i] = ((ti >> 10) & 42) * ti;
    }
    window.requestAnimationFrame(draw);
};
V.onclick = () => {
    const audioContext = new window.AudioContext();
    soundBuffer = audioContext.createBuffer(1, 22050 * 60, 44100);
    const soundSource = audioContext.createBufferSource();
    
    soundSource.buffer = soundBuffer;
    soundSource.connect(audioContext.destination);
    soundSource.start();

    V.requestFullscreen();
    V.style.cursor = 'none';
    V.onclick = null;
    //If we need delay before start
    //this can be used
    setTimeout(() => {window.requestAnimationFrame(draw);}, 0);
};