c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
var vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
//Remember to change time to be uniform float v and resolution to 640x360
//First two lines should be like precision highp float;uniform float v;
var fragmentShader = `precision highp float;uniform float v;struct v3{vec3 fr;vec3 sd;};struct en{float d;vec3 po;vec3 n;vec3 m;};struct ht{float d;en e;};vec2 e;vec3 n(vec3 e,vec3 v){vec3 m=sin(v),n=cos(v),d=vec3(n.z*e.x-m.z*e.y,m.z*e.x+n.z*e.y,e.z),s=vec3(n.y*d.x+m.y*d.z,d.y,-m.y*d.x+n.y*d.z);return vec3(s.x,n.x*s.y-m.x*s.z,m.x*s.y+n.x*s.z);}v3 s(vec3 v,vec3 m){return v3(mod(v+m*.5,m)-m*.5,floor((v+m*.5)/m));}en n(vec3 m){v3 d=s(n(m,vec3(v/2.,v,-v)),vec3(75.));en f;vec3 y=abs(n(d.fr,vec3(d.sd)+v*2.)+length(sin((e.xy+v)*13.)))-vec3(10.);f.d=min(max(y.x,max(y.y,y.z)),0.)+length(max(y,0.))-.3;f.m=abs(d.sd);return f;}ht s(vec3 m){ht v;for(int e=0;e<=64;e++){vec3 d=vec3(0.,30.,50.)+m*v.d;v.e=n(d);v.d+=v.e.d;if(abs(v.e.d)<.001){vec2 s=vec2(1e-4,0);v.e.n=normalize(vec3(n(d+s.xyy).d-n(d-s.xyy).d,n(d+s.yxy).d-n(d-s.yxy).d,n(d+s.yyx).d-n(d-s.yyx).d));break;}}return v;}void main(){vec2 v=vec2(640,360);e=gl_FragCoord.xy/v.xy*2.-1.;e.x*=v.x/v.y;ht d=s(normalize(vec3(0.,-.5145,-.8575)+e.x*vec3(-.75,0.,0.)+.75*e.y*vec3(0.,.8575,-.5145)));gl_FragColor=vec4(vec3(1.-smoothstep(0.,300.,d.d))*(d.e.m*.05*10.+max(dot(d.e.n,normalize(vec3(0.,100.,10.)-d.e.po)),0.)),1.);}`;

function createShader(src, type) {
    var shader = g.createShader(type);
    g.shaderSource(shader, src);
    g.compileShader(shader);
    return shader;
}

function draw(time) {  
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    g.enableVertexAttribArray(0);
  
    g.uniform1f(g.getUniformLocation(program, "v"), time / 1000);
    g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
};

V.onclick = () => {
    var audioContext = new AudioContext();
    var soundBuffer = audioContext.createBuffer(1, 22050 * 60, 44000);

    for (let t = 0; t < soundBuffer.length; t++) {
        //This tune is ripped from https://greggman.com/downloads/examples/html5bytebeat/html5bytebeat.htm
        //ryg 2011-10-10 (44k)
        //Write here tune
        soundBuffer.getChannelData(0)[t] = (
            ((t*("36364689"[t>>13&7]&15))/12&128)+(((((t>>12)^(t>>12)-2)%11*t)/4|t>>13)&127)
        & 255) / 127 - 1;
    }

    var soundSource = audioContext.createBufferSource();
    
    soundSource.buffer = soundBuffer;
    soundSource.connect(audioContext.destination);
    soundSource.start();

    c.requestFullscreen();
    c.style.cursor = 'none';
    c.onclick = null;

    var ab = g.ARRAY_BUFFER;
    g.bindBuffer(ab, g.createBuffer());
    g.bufferData(ab, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), g.STATIC_DRAW);

    program = g.createProgram();

    g.attachShader(program, createShader(vertexShader, g.VERTEX_SHADER));
    g.attachShader(program, createShader(fragmentShader, g.FRAGMENT_SHADER));

    g.linkProgram(program);
    g.useProgram(program);
    requestAnimationFrame(draw);
};