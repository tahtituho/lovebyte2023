w = 1920;
h = 1080;
V.width = w;
V.height = h;
let soundBuffer;
C.fillText("click here to start", w / 2, h / 2);

let balls = [
    {
        x: 150,
        y: 632,
        size: 3450,
        speed: 10,
        dX: 1,
        dY: 1,
        color: {
            r: 0,
            g: 0,
            b: 255,
            a: 255
        }
    },
    {   
        x: 723,
        y: 189,
        size: 4300,
        speed: 10,
        dX: 1,
        dY: 1,
        color: {
            r: 0,
            g: 0,
            b: 255,
            a: 255
        }
    },
    {
        x: 476,
        y: 845,
        size: 16750,
        speed: 10,
        dX: 1,
        dY: 1,
        color: {
            r: 0,
            g: 255,
            b: 0,
            a: 255
        }
    }
];
let grid = 5;
function draw(time) {
    C.clearRect(0, 0, w, h);
    const imageData = C.getImageData(0, 0, w, h);

    for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {          
                const v = b.size / (((b.x - x) ** 2) + ((b.y - y) ** 2));
                imageData.data[y * (w * 4) + x * 4 + 0] += v * b.color.r;
                imageData.data[y * (w * 4) + x * 4 + 1] += v * b.color.g;
                imageData.data[y * (w * 4) + x * 4 + 2] += v * b.color.b;
                imageData.data[y * (w * 4) + x * 4 + 3] = b.color.a;
            }
        }
 
        if (b.x > w || b.x < 0) {
            b.dX *= -1;
        }
        if (b.y > h || b.y < 0) {
            b.dY *= -1;
        }
        b.x += b.dX * b.speed;
        b.y += b.dY * b.speed;
    }
    C.putImageData(imageData, 0, 0);
    
    window.requestAnimationFrame(draw);
};
V.onclick = () => {
    const audioContext = new window.AudioContext();
    soundBuffer = audioContext.createBuffer(1, 22050 * 60, 44000);
    const nowBuffering = soundBuffer.getChannelData(0);
    for (let i = 0; i < soundBuffer.length; i++) {
        const t = i;
        //This tune is ripped from https://greggman.com/downloads/examples/html5bytebeat/html5bytebeat.htm
        //ryg 2011-10-10 (44k)
        //Write here tune
        let b = ((t*("36364689"[t>>13&7]&15))/12&128)+(((((t>>12)^(t>>12)-2)%11*t)/4|t>>13)&127);

        nowBuffering[i] = (b & 255) / 127 - 1;
    }

    const soundSource = audioContext.createBufferSource();
    
    soundSource.buffer = soundBuffer;
    soundSource.connect(audioContext.destination);
    //soundSource.start();

    V.requestFullscreen();
    V.style.cursor = 'none';
    V.onclick = null;
    //If we need delay before start
    //this can be used
    setTimeout(() => {window.requestAnimationFrame(draw);}, 0);
};