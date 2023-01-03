c3d = document.body.appendChild(document.createElement("canvas"));
c3d.width = 640;
c3d.height = 360;

gl = c3d.getContext("webgl");
var vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
//Remember to change time to be uniform float v and resolution to 640x360
//First two lines should be like precision highp float;uniform float v;
var fragmentShader = `precision highp float;uniform float v;struct v3t{vec3 fr;vec3 sd;};struct en{float d;vec3 po;vec3 n;vec4 mt1;vec4 mt2;};struct hit{float d;en en;};vec2 n;en s(en v,en n,float y,float z){float d=clamp(.5+.5*(n.d-v.d)/y,0.,1.),x=mix(n.d,v.d,d)-y*d*(1.-d);if(smoothstep(v.d,n.d,x+z)>.5)return n.d=x,n;else return v.d=x,v;}vec3 s(vec3 v,vec3 n){float x=sin(n.z),d=cos(n.z);vec3 m=vec3(d*v.x-x*v.y,x*v.x+d*v.y,v.z);float y=sin(n.y),s=cos(n.y);vec3 e=vec3(s*m.x+y*m.z,m.y,-y*m.x+s*m.z);float f=sin(n.x),z=cos(n.x);return vec3(e.x,z*e.y-f*e.z,f*e.y+z*e.z);}v3t e(vec3 v,vec3 z){return v3t(mod(v+z*.5,z)-z*.5,floor((v+z*.5)/z));}en e(vec3 v,vec3 d,vec4 n,vec4 z){en e;vec3 m=abs(v)-d;e.d=min(max(m.x,max(m.y,m.z)),0.)+length(max(m,0.))-.3;e.mt1=n;e.mt2=z;return e;}en e(vec3 z){float m=v/2.;v3t d=e(s(z,vec3(0.,m,3.2)),vec3(3.5,0.,3.5));float x=v*10.,y=sin((d.sd.x+x)/10.)*cos((d.sd.z+x)/5.);en f=e(s(d.fr+vec3(0.,sin(v)*10.+y*10.+25.,0.)*-1.,vec3(sin(v)*4.*y)),vec3(1.),vec4(.01,0.,.17,.25),vec4(.95,.73,.77,.05));d=e(s(z,vec3(m,v,-v)),vec3(75.));en r=e(s(d.fr,vec3(d.sd)+v)+length(sin((n.xy+v)*13.)),vec3(10.),vec4(abs(d.sd.xyz),.05),vec4(vec3(1.),.05));return s(f,r,10.,0.);}vec3 s(vec3 v){vec3 n=vec3(1,-1,.001);return normalize(n.xyy*e(v+n.xyy*n.z).d+n.yyx*e(v+n.yyx*n.z).d+n.yxy*e(v+n.yxy*n.z).d+n.xxx*e(v+n.xxx*n.z).d);}hit x(vec3 z){hit v;for(int d=0;d<=64;d++){vec3 n=vec3(0.,30.,50.)+z*v.d;v.en=e(n);v.d+=v.en.d;if(abs(v.en.d)<.001){v.en.n=s(n);break;}}return v;}void main(){vec2 v=vec2(640,360);n=gl_FragCoord.xy/v.xy*2.-1.;n.x*=v.x/v.y;hit m=x(normalize(vec3(0.,-.5145,-.8575)+n.x*vec3(-.75,0.,0.)+.75*n.y*vec3(0.,.8575,-.5145)));vec3 d=m.en.mt1.xyz*m.en.mt1.w*10.;float z=max(dot(m.en.n,normalize(vec3(0.,100.,10.)-m.en.po)),0.);vec3 y=z*m.en.mt2.xyz*m.en.mt2.w*10.,f=vec3(1.-smoothstep(0.,300.,m.d))*(d+y);gl_FragColor=vec4(f,1.);}`;

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

    c3d.requestFullscreen();
    c3d.style.cursor = 'none';
    c3d.onclick = null;

    var buffer = gl.createBuffer();
    var ab = gl.ARRAY_BUFFER;
    gl.bindBuffer(ab, buffer);
    gl.bufferData(ab, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);

    program = gl.createProgram();

    gl.attachShader(program, createShader(vertexShader, gl.VERTEX_SHADER));
    gl.attachShader(program, createShader(fragmentShader, gl.FRAGMENT_SHADER));

    gl.linkProgram(program);
    gl.useProgram(program);
    gl.bindBuffer(ab, buffer);
    window.requestAnimationFrame(draw);
};