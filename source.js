w = 1920;
h = 1080;
V.style = "display:none;";
let soundBuffer;
const c3d = document.createElement("canvas");
c3d.width = w;
c3d.height = h;
document.body.appendChild(c3d);
let program, buffer, timeUniform, resolutionUniform, positionAttribute;

const gl = c3d.getContext("webgl", { antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
const vertexShader = `
attribute vec3 position;
void main() {
    gl_Position = vec4(position, 1.0);
}
`;
const fragmentShader = `
precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy);
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
}
`;

function createShader(src, type) {

    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    let t =  gl.getShaderInfoLog(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var error = gl.getShaderInfoLog(shader);
        console.log(error);
        return null;
    }
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
    gl.uniform2f(resolutionUniform, w, h);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.useProgram(null);
    window.requestAnimationFrame(draw);
};

c3d.onclick = () => {
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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error( 'VALIDATE_STATUS: ' + gl.getProgramParameter(program, gl.VALIDATE_STATUS), 'ERROR: ' + gl.getError() );
        return null;
    }
 
    timeUniform = gl.getUniformLocation(program, "time");
    resolutionUniform = gl.getUniformLocation(program, "resolution");
    positionAttribute = gl.getAttribLocation(program, "position");

    //If we need delay before start
    //this can be used
    setTimeout(() => {window.requestAnimationFrame(draw);}, 0);
};