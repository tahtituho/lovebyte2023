c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision precision highp float;uniform float y;float x;
var fragmentShader = `precision lowp float;uniform float y;float x;vec3 m,z;vec2 f;vec3 s(vec3 v,vec3 m){vec3 f=sin(m),y=cos(m),x=vec3(y.z*v.x-f.z*v.y,f.z*v.x+y.z*v.y,v.z),z=vec3(y.y*x.x+f.y*x.z,x.y,-f.y*x.x+y.y*x.z);return vec3(z.x,y.x*z.y-f.x*z.z,f.x*z.y+y.x*z.z);}float s(vec3 v){vec3 x=vec3(75.);v=s(v,vec3(y/2.,y,-y));vec3 z=floor((v+x*.5)/x),d=abs(s(mod(v+x*.5,x)-x*.5,vec3(z)+y*2.)+length(sin((f.xy+y)*13.)))-vec3(10.);m=abs(z);return min(max(d.x,max(d.y,d.z)),0.)+length(max(d,0.))-2.;}void main(){vec2 v=vec2(640,360);f=gl_FragCoord.xy/v.xy*2.-1.;f.x*=v.x/v.y;for(int y=0;y<=64;y++){vec3 d=vec3(25.,30.,0.)+normalize(vec3(0.,-.5145,-.8575)+f.x*vec3(-.75,0.,0.)+f.y*vec3(0.,.6443,-.3859))*x;float a=s(d);x+=a;vec2 l=vec2(.001,0);if(a<l.x){z=normalize(vec3(s(d+l.xyy)-a,s(d+l.yxy)-a,s(d+l.yyx)-a));break;}}gl_FragColor=vec4(vec3(smoothstep(300.,0.,x))*(m+max(dot(z,vec3(0.,1.,.1)),0.)),1.);}`;
a = new AudioContext();

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
    requestAnimationFrame(draw);
}

V.onclick = _ => {
    var soundBuffer = a.createBuffer(1, q = 22050 * 30, 44000);

    for (t = 0; t < q; t++) {
        //This tune is ripped from https://greggman.com/downloads/examples/html5bytebeat/html5bytebeat.htm
        //ryg 2011-10-10 (44k)
        //Write here tune
        soundBuffer.getChannelData(0)[t] = (
            ((t*("36364689"[t>>13&7]&15))/12&128)+(((((t>>12)^(t>>12)-2)%11*t)/4|t>>13)&127)
        & 255) / 127 - 1;
    }

    var soundSource = a.createBufferSource();
    
    soundSource.buffer = soundBuffer;
    soundSource.connect(a.destination);
    soundSource.start();

    c.requestFullscreen();
    c.style.cursor = 'none';

    g.bindBuffer(ab = 34962, g.createBuffer());
    g.bufferData(ab, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), 35044);

    g.attachShader(p = g.createProgram(), createShader(`attribute vec3 p;void main(){gl_Position=vec4(p,1.);}`, 35633));
    g.attachShader(p, createShader(fragmentShader, 35632));

    g.linkProgram(p);
    g.useProgram(p);
    requestAnimationFrame(draw);
}