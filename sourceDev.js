c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision lowp float;uniform float y;float x;
var fragmentShader = `precision lowp float;uniform float y;float x;vec3 z,s;vec2 f,c=vec2(640,360);vec3 n(vec3 y,vec3 v){vec3 f=sin(v),s=cos(v),c=vec3(s.z*y.x-f.z*y.y,f.z*y.x+s.z*y.y,y.z),x=vec3(s.y*c.x+f.y*c.z,c.y,-f.y*c.x+s.y*c.z);return vec3(x.x,s.x*x.y-f.x*x.z,f.x*x.y+s.x*x.z);}float n(vec3 s){return s+=sin(n(s,vec3(y,y,-y))*2.)*.06,s=n(s,vec3(y,y/2.,-y)),z=vec3(1.)+length(tan(s*20.)/4.),abs(dot(sin(s),cos(s.zxy))-2.85)-1.85;}void main(){f=gl_FragCoord.xy/c.xy*2.-1.;f.x*=c.x/c.y;for(int v=0;v<=64;v++){s=vec3(0.,0.,y)+normalize(vec3(0.,-.5145,-.8575)+f.x*vec3(-.75,0.,0.)+f.y*vec3(0.,.6443,-.3859))*x;float t=n(s);x+=t;vec2 l=vec2(.1,0);s=normalize(vec3(n(s+l.xyy)-t,n(s+l.yxy)-t,n(s+l.yyx)-t));}z*=s;gl_FragColor=vec4(z*max(dot(s,vec3(0.,1.,1.)),0.)*vec3(smoothstep(25.,0.,x)),1.);}`;

a = new AudioContext();
f = requestAnimationFrame;
function createShader(src, type) {
    var shader = g.createShader(type);
    g.shaderSource(shader, src);
    g.compileShader(shader);
    return shader;
}

function draw() {  
    g.uniform1f(g.getUniformLocation(p, "y"), a.currentTime / 2);
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