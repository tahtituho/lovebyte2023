c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision lowp float;uniform float y;float x;
var fragmentShader = `precision lowp float;uniform float y;float x;vec3 m,r;vec2 f;vec3 n(vec3 v,vec3 y){vec3 f=sin(y),m=cos(y),x=vec3(m.z*v.x-f.z*v.y,f.z*v.x+m.z*v.y,v.z),r=vec3(m.y*x.x+f.y*x.z,x.y,-f.y*x.x+m.y*x.z);return vec3(r.x,m.x*r.y-f.x*r.z,f.x*r.y+m.x*r.z);}float n(vec3 v){vec3 x=vec3(75.);v=n(v,vec3(y/2.,y,-y));vec3 r=floor((v+x*.5)/x);m=abs(r+sin(y));r=abs(n(mod(v+x*.5,x)-x*.5,vec3(r)+y*2.)+length(sin((f.xy+y)*13.)))-vec3(10.);return min(max(r.x,max(r.y,r.z)),0.)+length(max(r,0.))-2.;}void main(){vec2 v=vec2(640,360);f=gl_FragCoord.xy/v.xy*2.-1.;f.x*=v.x/v.y;for(int l=0;l<=64;l++){vec3 z=vec3(25.,30.,y*3.)+normalize(vec3(0.,-.5145,-.8575)+f.x*vec3(-.75,0.,0.)+f.y*vec3(0.,.6443,-.3859))*x;float a=n(z);x+=a;vec2 i=vec2(.001,0);r=normalize(vec3(n(z+i.xyy)-a,n(z+i.yxy)-a,n(z+i.yyx)-a));}gl_FragColor=vec4(vec3(smoothstep(300.,0.,x))*(m+max(dot(r,vec3(0.,1.,.1)),0.)),1.);}`;

a = new AudioContext();
f = requestAnimationFrame;
function createShader(src, type) {
    var shader = g.createShader(type);
    g.shaderSource(shader, src);
    g.compileShader(shader);
    return shader;
}

function draw() {  
    g.uniform1f(g.getUniformLocation(p, "y"), a.currentTime);
    g.drawArrays(0, 0, 1);
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

    g.attachShader(p = g.createProgram(), createShader(`void main(){gl_Position=vec4(0.,0.,0.,1.);gl_PointSize=700.;}`, 35633));
    g.attachShader(p, createShader(fragmentShader, 35632));

    g.linkProgram(p);
    g.useProgram(p);

    g.enableVertexAttribArray(0);
    g.bindBuffer(34962, g.createBuffer());
    g.vertexAttribPointer(0, 1, 5126, false, 0, 0);
    f(draw);
}