c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision precision highp float;uniform float y;float x;
var fragmentShader = `precision lowp float;uniform float y;float x;vec3 m,z;vec2 f;vec3 n(vec3 v,vec3 y){vec3 f=sin(y),m=cos(y),x=vec3(m.z*v.x-f.z*v.y,f.z*v.x+m.z*v.y,v.z),z=vec3(m.y*x.x+f.y*x.z,x.y,-f.y*x.x+m.y*x.z);return vec3(z.x,m.x*z.y-f.x*z.z,f.x*z.y+m.x*z.z);}float n(vec3 v){vec3 x=vec3(75.);v=n(v,vec3(y/2.,y,-y));vec3 z=floor((v+x*.5)/x),s=abs(n(mod(v+x*.5,x)-x*.5,vec3(z)+y*2.)+length(sin((f.xy+y)*13.)))-vec3(10.);m=abs(z+sin(y));return min(max(s.x,max(s.y,s.z)),0.)+length(max(s,0.))-2.;}void main(){vec2 v=vec2(640,360);f=gl_FragCoord.xy/v.xy*2.-1.;f.x*=v.x/v.y;for(int r=0;r<=64;r++){vec3 s=vec3(25.,30.,y*3.)+normalize(vec3(0.,-.5145,-.8575)+f.x*vec3(-.75,0.,0.)+f.y*vec3(0.,.6443,-.3859))*x;float a=n(s);x+=a;vec2 l=vec2(.001,0);if(a<l.x){z=normalize(vec3(n(s+l.xyy)-a,n(s+l.yxy)-a,n(s+l.yyx)-a));break;}}gl_FragColor=vec4(vec3(smoothstep(300.,0.,x))*(m+max(dot(z,vec3(0.,1.,.1)),0.)),1.);}`;
a = new AudioContext();
f = requestAnimationFrame;
function createShader(src, type) {
    var shader = g.createShader(type);
    g.shaderSource(shader, src);
    g.compileShader(shader);
    return shader;
}

function draw() {  
    g.vertexAttribPointer(0, 2, 5126, false, 0, 0);
    g.enableVertexAttribArray(0);
  
    g.uniform1f(g.getUniformLocation(p, "y"), a.currentTime);
    g.drawArrays(5, 0, 4);
    f(draw);
}

c.onclick = _ => {
    var soundBuffer = a.createBuffer(1, q = 22050 * 30, 44000);

    for (t = 0; t < q; t++) {
        //This tune is ripped from https://greggman.com/downloads/examples/html5bytebeat/html5bytebeat.htm
        //ryg 2011-10-10 (44k)
        //Write here tune
        soundBuffer.getChannelData(0)[t] = (
            ((t*("36364689"[t>>13&7]&15))/12&128)+(((((t>>12)^(t>>12)-2)%11*t)/4|t>>13)&127)
        & 255) / 127 - 1;
    }

    k = a.createBufferSource();
    
    k.buffer = soundBuffer;
    k.connect(a.destination);
    k.start();

    c.requestFullscreen();
    c.style.cursor = 'none';

    g.bindBuffer(j = 34962, g.createBuffer());
    g.bufferData(j, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), 35044);

    g.attachShader(p = g.createProgram(), createShader(`attribute vec3 p;void main(){gl_Position=vec4(p,1.);}`, 35633));
    g.attachShader(p, createShader(fragmentShader, 35632));

    g.linkProgram(p);
    g.useProgram(p);
    f(draw);
}