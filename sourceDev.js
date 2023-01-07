c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
var vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
//Remember to change time to be uniform float v and resolution to 640x360
//First two lines should be like precision highp float;uniform float v;
var fragmentShader = `precision highp float;uniform float v;struct v3{vec3 fr;vec3 sd;};struct en{float d;vec3 po;vec3 n;vec4 m1;vec4 m2;};struct ht{float d;en en;};vec2 n;vec3 s(vec3 n,vec3 v){float m=sin(v.z),s=cos(v.z);vec3 d=vec3(s*n.x-m*n.y,m*n.x+s*n.y,n.z);float e=sin(v.y),y=cos(v.y);vec3 a=vec3(y*d.x+e*d.z,d.y,-e*d.x+y*d.z);float f=sin(v.x),x=cos(v.x);return vec3(a.x,x*a.y-f*a.z,f*a.y+x*a.z);}v3 e(vec3 v,vec3 m){return v3(mod(v+m*.5,m)-m*.5,floor((v+m*.5)/m));}en e(vec3 m){v3 d=e(s(m,vec3(v/2.,v,-v)),vec3(75.));en f;vec3 a=abs(s(d.fr,vec3(d.sd)+v*2.)+length(sin((n.xy+v)*13.)))-vec3(10.);f.d=min(max(a.x,max(a.y,a.z)),0.)+length(max(a,0.))-.3;f.m1=vec4(abs(d.sd.xyz),.05);f.m2=vec4(vec3(1.),.1);return f;}ht s(vec3 m){ht v;for(int f=0;f<=64;f++){vec3 d=vec3(0.,30.,50.)+m*v.d;v.en=e(d);v.d+=v.en.d;if(abs(v.en.d)<.001){vec2 n=vec2(1e-4,0);v.en.n=normalize(vec3(e(d+n.xyy).d-e(d-n.xyy).d,e(d+n.yxy).d-e(d-n.yxy).d,e(d+n.yyx).d-e(d-n.yyx).d));break;}}return v;}void main(){vec2 v=vec2(640,360);n=gl_FragCoord.xy/v.xy*2.-1.;n.x*=v.x/v.y;ht d=s(normalize(vec3(0.,-.5145,-.8575)+n.x*vec3(-.75,0.,0.)+.75*n.y*vec3(0.,.8575,-.5145)));gl_FragColor=vec4(vec3(1.-smoothstep(0.,300.,d.d))*(d.en.m1.xyz*d.en.m1.w*10.+max(dot(d.en.n,normalize(vec3(0.,100.,10.)-d.en.po)),0.)*d.en.m2.xyz*d.en.m2.w*10.),1.);}`;

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