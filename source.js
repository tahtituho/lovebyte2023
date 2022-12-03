w = 640;
h = 360;
var c3d = document.body.appendChild(document.createElement("canvas"));
c3d.width = w;
c3d.height = h;

var program, buffer;

var gl = c3d.getContext("webgl");
var ab = gl.ARRAY_BUFFER;
var vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
var fragmentShader = `precision highp float;uniform float v;struct v3t{vec3 fr;vec3 sd;};struct en{float d;vec3 po;vec3 n;vec4 mt1;vec4 mt2;};struct hit{float d;en en;};en n(en v,en n,float y,float z){float x=clamp(.5+.5*(n.d-v.d)/y,0.,1.),d=mix(n.d,v.d,x)-y*x*(1.-x);if(smoothstep(v.d,n.d,d+z)>.5)return n.d=d,n;else return v.d=d,v;}vec3 n(vec3 v,vec3 n){float x=sin(n.z),y=cos(n.z);vec3 d=vec3(y*v.x-x*v.y,x*v.x+y*v.y,v.z);float e=sin(n.y),m=cos(n.y);vec3 s=vec3(m*d.x+e*d.z,d.y,-e*d.x+m*d.z);float f=sin(n.x),z=cos(n.x);return vec3(s.x,z*s.y-f*s.z,f*s.y+z*s.z);}vec3 e(vec3 d,vec3 z){return d+z*-1.;}v3t s(vec3 v,vec3 z){return v3t(mod(v+z*.5,z)-z*.5,floor((v+z*.5)/z));}en e(vec3 v,vec3 d,vec4 n,vec4 z){en s;vec3 m=abs(v)-d;s.d=min(max(m.x,max(m.y,m.z)),0.)+length(max(m,0.))-.15;s.po=v;s.mt1=n;s.mt2=z;return s;}en s(vec3 v,vec2 n,vec4 d,vec4 z){return en(length(vec2(length(v.xz)-n.x,v.y))-n.y,v,vec3(0),d,z);}en e(vec3 z){v3t d=s(n(z,vec3(0.,v/2.,3.2)),vec3(3.5,0.,3.5));float x=v*10.,y=sin((d.sd.x+x)/10.)*cos((d.sd.z+x)/5.);en m=e(n(e(d.fr,vec3(0.,sin(v)*10.+y*10.,0.)),vec3(sin(v)*4.*y)),vec3(1.),vec4(.01,0.,.17,.25),vec4(.25,.73,.77,.05));vec3 f=n(z,vec3(-v)),o=vec3(8.,0.,0.);en r=s(e(f,o),vec2(16.,5.),vec4(.55,.07,.59,.1),vec4(1.,.99,0.,.1)),c=s(e(n(f,vec3(1.57,0.,0.)),-o),vec2(16.,5.),vec4(.55,.07,.59,.1),vec4(1.,.99,0.,.1));return n(m,n(r,c,0.,0.),1.5,0.);}vec3 n(vec3 v){vec3 n=vec3(1,-1,.001);return normalize(n.xyy*e(v+n.xyy*n.z).d+n.yyx*e(v+n.yyx*n.z).d+n.yxy*e(v+n.yxy*n.z).d+n.xxx*e(v+n.xxx*n.z).d);}hit x(vec3 v,vec3 z){hit s;for(int d=0;d<=64;d++){vec3 m=v+z*s.d;s.en=e(m);s.d+=s.en.d;if(abs(s.en.d)<.001){s.en.n=n(m);break;}}return s;}void main(){vec2 n=vec2(640,360);float v=n.x/n.y;vec2 s=gl_FragCoord.xy/n.xy*2.-1.;s.x*=v;vec3 z=vec3(0.,30.,60.),d=normalize(vec3(0.)-z),m=normalize(vec3(d.z,0.,-d.x)),y=normalize(d+.75*s.x*m+.75*s.y*normalize(cross(d,m)));hit f=x(z,y);vec3 e=f.en.mt1.xyz*f.en.mt1.w*10.;float c=max(dot(f.en.n,normalize(vec3(0.,10.,0.)-f.en.po)),0.);vec3 o=c*f.en.mt2.xyz*f.en.mt2.w*10.,r=vec3(1.-smoothstep(0.,300.,f.d))*(e+o);gl_FragColor=vec4(r,1.);}`;

function createShader(src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
}

function draw(time) {
    gl.bindBuffer(ab, buffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
  
    gl.uniform1f(gl.getUniformLocation(program, "v"), time / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    window.requestAnimationFrame(draw);
};

V.onclick = () => {
    const audioContext = new window.AudioContext();
    const soundBuffer = audioContext.createBuffer(1, 22050 * 60, 44000);
    const nowBuffering = soundBuffer.getChannelData(0);

    for (let t = 0; t < soundBuffer.length; t++) {
        //This tune is ripped from https://greggman.com/downloads/examples/html5bytebeat/html5bytebeat.htm
        //ryg 2011-10-10 (44k)
        //Write here tune
        nowBuffering[t] = (
            ((t*("36364689"[t>>13&7]&15))/12&128)+(((((t>>12)^(t>>12)-2)%11*t)/4|t>>13)&127)
        & 255) / 127 - 1;
    }

    const soundSource = audioContext.createBufferSource();
    
    soundSource.buffer = soundBuffer;
    soundSource.connect(audioContext.destination);
    //soundSource.start();

    c3d.requestFullscreen();
    c3d.style.cursor = 'none';
    c3d.onclick = null;

    buffer = gl.createBuffer();
    gl.bindBuffer(ab, buffer);
    gl.bufferData(ab, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);

    program = gl.createProgram();

    gl.attachShader(program, createShader(vertexShader, gl.VERTEX_SHADER));
    gl.attachShader(program, createShader(fragmentShader, gl.FRAGMENT_SHADER));

    gl.linkProgram(program);
    gl.useProgram(program);
    window.requestAnimationFrame(draw);
};