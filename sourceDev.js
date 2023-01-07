c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

gl = c.getContext("webgl");
var vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
//Remember to change time to be uniform float v and resolution to 640x360
//First two lines should be like precision highp float;uniform float v;
var fragmentShader = `precision highp float;uniform float v;struct v3{vec3 fr;vec3 sd;};struct en{float d;vec3 po;vec3 n;vec4 m1;vec4 m2;};struct ht{float d;en en;};vec2 n;en s(en n,en d){if(n.d<d.d)return n;return d;}vec3 e(vec3 v,vec3 n){float s=sin(n.z),e=cos(n.z);vec3 d=vec3(e*v.x-s*v.y,s*v.x+e*v.y,v.z);float m=sin(n.y),y=cos(n.y);vec3 f=vec3(y*d.x+m*d.z,d.y,-m*d.x+y*d.z);float x=sin(n.x),l=cos(n.x);return vec3(f.x,l*f.y-x*f.z,x*f.y+l*f.z);}v3 f(vec3 v,vec3 m){return v3(mod(v+m*.5,m)-m*.5,floor((v+m*.5)/m));}en e(vec3 v,vec3 d,vec4 n,vec4 m){en f;vec3 e=abs(v)-d;f.d=min(max(e.x,max(e.y,e.z)),0.)+length(max(e,0.))-.3;f.m1=n;f.m2=m;return f;}en e(vec3 m){float d=v/2.,y=v*10.;v3 r=f(e(m,vec3(0.,d,3.2)),vec3(3.5,0.,3.5));float x=sin((r.sd.x+y)/10.)*sin((r.sd.z+y)/5.);en a=e(e(r.fr-vec3(0.,sin(v)*10.+x*10.+25.,0.),vec3(sin(v)*4.)*x),vec3(1.),vec4(.01,0.,.17,.25),vec4(.95,.73,.77,.05));r=f(e(m,vec3(d,v,-v)),vec3(75.));en z=e(e(r.fr,vec3(r.sd)+v)+length(sin((n.xy+v)*13.)),vec3(10.),vec4(abs(r.sd.xyz),.05),vec4(vec3(1.),.1));return s(a,z);}ht f(vec3 m){ht v;for(int f=0;f<=64;f++){vec3 d=vec3(0.,30.,50.)+m*v.d;v.en=e(d);v.d+=v.en.d;if(abs(v.en.d)<.001){vec2 n=vec2(1e-4,0);v.en.n=normalize(vec3(e(d+n.xyy).d-e(d-n.xyy).d,e(d+n.yxy).d-e(d-n.yxy).d,e(d+n.yyx).d-e(d-n.yyx).d));break;}}return v;}void main(){vec2 v=vec2(640,360);n=gl_FragCoord.xy/v.xy*2.-1.;n.x*=v.x/v.y;ht d=f(normalize(vec3(0.,-.5145,-.8575)+n.x*vec3(-.75,0.,0.)+.75*n.y*vec3(0.,.8575,-.5145)));gl_FragColor=vec4(vec3(1.-smoothstep(0.,300.,d.d))*(d.en.m1.xyz*d.en.m1.w*10.+max(dot(d.en.n,normalize(vec3(0.,100.,10.)-d.en.po)),0.)*d.en.m2.xyz*d.en.m2.w*10.),1.);}`;

function createShader(src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
}

function draw(time) {  
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
  
    gl.uniform1f(gl.getUniformLocation(program, "v"), time / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    window.requestAnimationFrame(draw);
};

V.onclick = () => {
    const audioContext = new window.AudioContext();
    const soundBuffer = audioContext.createBuffer(1, 22050 * 60, 44000);

    for (let t = 0; t < soundBuffer.length; t++) {
        //This tune is ripped from https://greggman.com/downloads/examples/html5bytebeat/html5bytebeat.htm
        //ryg 2011-10-10 (44k)
        //Write here tune
        soundBuffer.getChannelData(0)[t] = (
            ((t*("36364689"[t>>13&7]&15))/12&128)+(((((t>>12)^(t>>12)-2)%11*t)/4|t>>13)&127)
        & 255) / 127 - 1;
    }

    const soundSource = audioContext.createBufferSource();
    
    soundSource.buffer = soundBuffer;
    soundSource.connect(audioContext.destination);
    soundSource.start();

    c.requestFullscreen();
    c.style.cursor = 'none';
    c.onclick = null;

    var ab = gl.ARRAY_BUFFER;
    gl.bindBuffer(ab, gl.createBuffer());
    gl.bufferData(ab, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);

    program = gl.createProgram();

    gl.attachShader(program, createShader(vertexShader, gl.VERTEX_SHADER));
    gl.attachShader(program, createShader(fragmentShader, gl.FRAGMENT_SHADER));

    gl.linkProgram(program);
    gl.useProgram(program);
    window.requestAnimationFrame(draw);
};