w = 640;
h = 360;
let c3d = document.createElement("canvas");
c3d.width = w;
c3d.height = h;
document.body.appendChild(c3d);
let program, buffer, timeUniform, positionAttribute;

const gl = c3d.getContext("webgl");
const vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
const fragmentShader = `
`;
function createShader(src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
}

function draw(time) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); 
    gl.clearDepth(1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(positionAttribute);
    gl.useProgram(program);
    gl.uniform1f(timeUniform, time / 1000 );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(null);
    window.requestAnimationFrame(draw);
};

V.onclick = () => {
    const audioContext = new window.AudioContext();
    const soundBuffer = audioContext.createBuffer(1, 22050 * 60, 44000);
    const nowBuffering = soundBuffer.getChannelData(0);
    //is there way to create array like in linq? (generator?)
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
    soundSource.start();

    c3d.requestFullscreen();
    c3d.style.cursor = 'none';
    c3d.onclick = null;

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]), gl.STATIC_DRAW);

    program = gl.createProgram();

    var vs = createShader(vertexShader, gl.VERTEX_SHADER);
    var fs = createShader(fragmentShader, gl.FRAGMENT_SHADER);

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);
    timeUniform = gl.getUniformLocation(program, "time");
    positionAttribute = gl.getAttribLocation(program, "position");
    window.requestAnimationFrame(draw);
};