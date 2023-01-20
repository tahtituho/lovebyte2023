c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision lowp float;uniform float y;float x;
var fragmentShader = `precision lowp float;uniform float y;float x;vec3 m,z;vec2 f,a=vec2(640,360);vec3 n(vec3 v,vec3 z){vec3 f=sin(z),y=cos(z);v=vec3(y.z*v.x-f.z*v.y,f.z*v.x+y.z*v.y,v.z);return vec3(y.y*v.x+f.y*v.z,v.y,-f.y*v.x+y.y*v.z);}float n(vec3 z){vec3 v=vec3(75.);z=n(z,vec3(y/2.,y,-y));vec3 x=floor((z+v*.5)/v);m=abs(x+sin(y));x=abs(n(mod(z+v*.5,v)-v*.5,vec3(x)+y*2.)+length(sin((f.xy+y)*13.)))-vec3(10.);return min(max(x.x,max(x.y,x.z)),0.)+length(max(x,0.))-2.;}void main(){f=gl_FragCoord.xy/a.xy*2.-1.;f.x*=a.x/a.y;for(int v=0;v<=64;v++){z=vec3(25.,9.,y*3.)+normalize(vec3(0.,-.5145,-.8575)+f.x*vec3(-.75,0.,0.)+f.y*vec3(0.,.6443,-.3859))*x;float c=n(z);x+=c;vec2 l=vec2(.001,0);z=normalize(vec3(n(z+l.xyy)-c,n(z+l.yxy)-c,n(z+l.yyx)-c));}gl_FragColor=vec4(m*max(dot(z,vec3(0.,1.,.1)),0.)*vec3(smoothstep(300.,0.,x)),1.);}`;

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

    g.attachShader(p = g.createProgram(), createShader(`void main(){gl_Position=vec4(0.,0.,0.,1.);gl_PointSize=700.;}`, 35633));
    g.attachShader(p, createShader(fragmentShader, 35632));

    g.linkProgram(p);
    g.useProgram(p);

    g.enableVertexAttribArray(0);
    g.bindBuffer(34962, g.createBuffer());
    g.vertexAttribPointer(0, 1, 5126, false, 0, 0);
    f(draw);
}