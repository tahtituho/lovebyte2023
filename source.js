w = 640;
h = 360;
c3d = document.body.appendChild(document.createElement("canvas"));
c3d.width = w;
c3d.height = h;

gl = c3d.getContext("webgl");
var vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
//Remember to change time to be uniform float v and resolution to 640x360
var fragmentShader = `precision highp float;uniform float v;struct v3t{vec3 fr;vec3 sd;};struct en{float d;vec3 po;vec3 n;vec4 mt1;vec4 mt2;};struct hit{float d;en en;};vec2 n;en s(en v,en n,float y,float z){float x=clamp(.5+.5*(n.d-v.d)/y,0.,1.),d=mix(n.d,v.d,x)-y*x*(1.-x);if(smoothstep(v.d,n.d,d+z)>.5)return n.d=d,n;else return v.d=d,v;}vec3 s(vec3 v,vec3 n){float x=sin(n.z),d=cos(n.z);vec3 f=vec3(d*v.x-x*v.y,x*v.x+d*v.y,v.z);float y=sin(n.y),m=cos(n.y);vec3 s=vec3(m*f.x+y*f.z,f.y,-y*f.x+m*f.z);float e=sin(n.x),z=cos(n.x);return vec3(s.x,z*s.y-e*s.z,e*s.y+z*s.z);}vec3 e(vec3 d,vec3 z){return d+z*-1.;}v3t x(vec3 v,vec3 z){return v3t(mod(v+z*.5,z)-z*.5,floor((v+z*.5)/z));}en e(vec3 v,vec3 d,vec4 n,vec4 z){en f;vec3 s=abs(v)-d;f.d=min(max(s.x,max(s.y,s.z)),0.)+length(max(s,0.))-.3;f.mt1=n;f.mt2=z;return f;}en e(vec3 z){float d=v/2.;v3t f=x(s(z,vec3(0.,d,3.2)),vec3(3.5,0.,3.5));float m=v*10.,y=sin((f.sd.x+m)/10.)*cos((f.sd.z+m)/5.);en r=e(s(e(f.fr,vec3(0.,sin(v)*10.+y*10.+25.,0.)),vec3(sin(v)*4.*y)),vec3(1.),vec4(.01,0.,.17,.25),vec4(.95,.73,.77,.05));f=x(s(z,vec3(d,v,-v)),vec3(75.,75.,75.));en h=e(s(f.fr,vec3(f.sd)+v)+length(sin((n.xy+v)*13.)),vec3(10.,10.,10.),vec4(abs(f.sd.xyz),.05),vec4(1.,1.,1.,.05));return s(r,h,10.,0.);}vec3 s(vec3 v){vec3 n=vec3(1,-1,.001);return normalize(n.xyy*e(v+n.xyy*n.z).d+n.yyx*e(v+n.yyx*n.z).d+n.yxy*e(v+n.yxy*n.z).d+n.xxx*e(v+n.xxx*n.z).d);}hit f(vec3 v,vec3 z){hit n;for(int f=0;f<=64;f++){vec3 d=v+z*n.d;n.en=e(d);n.d+=n.en.d;if(abs(n.en.d)<.001){n.en.n=s(d);break;}}return n;}void main(){vec2 v=vec2(640,360);float d=v.x/v.y;n=gl_FragCoord.xy/v.xy*2.-1.;n.x*=d;vec3 z=vec3(0.,30.,50.),s=normalize(-z),x=normalize(vec3(s.z,0.,-s.x));hit m=f(z,normalize(s+.75*n.x*x+.75*n.y*normalize(cross(s,x))));vec3 e=m.en.mt1.xyz*m.en.mt1.w*10.;float y=max(dot(m.en.n,normalize(vec3(0.,100.,10.)-m.en.po)),0.);vec3 r=y*m.en.mt2.xyz*m.en.mt2.w*10.,h=vec3(1.-smoothstep(0.,300.,m.d))*(e+r);gl_FragColor=vec4(h,1.);}`;

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
    //soundSource.start();

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