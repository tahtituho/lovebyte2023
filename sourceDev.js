c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision lowp float;uniform float y;float x;
var fragmentShader = `precision lowp float;uniform float y;float x,z,c;vec3 i,n,d;vec2 f,t;vec3 s(vec3 v,vec3 i){return n=sin(i),d=cos(i),v=vec3(d.z*v.x-n.z*v.y,n.z*v.x+d.z*v.y,v.z),vec3(d.y*v.x+n.y*v.z,v.y,-n.y*v.x+d.y*v.z);}float s(vec3 v){return v=s(v,vec3(-y)),v+=sin(s(v,vec3(y))*2.)*.1,z=length(tan(v*20.)),abs(dot(sin(v),cos(v.zxy))-2.8)-1.8;}void main(){vec2 v=vec2(640,360);f=gl_FragCoord.xy/v.xy*2.-1.;f.x*=v.x/v.y;for(int n=0;n<=64;n++)i=vec3(y/6.2)+normalize(vec3(0.,-.5145,-.8575)+f.x*vec3(-.75,0.,0.)+f.y*vec3(0.,.6443,-.3859))*x,c=s(i),x+=c,t=vec2(.1,0.),i=normalize(vec3(s(i+t.xyy)-c,s(i+t.yxy)-c,s(i+t.yyx)-c));gl_FragColor=vec4(z*i*max(dot(i,vec3(0.,1.,.5)),0.)*vec3(step(x,20.)),1.);}`;

a = new AudioContext();
f = requestAnimationFrame;
function createShader(src, type, shader = g.createShader(type)) {
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