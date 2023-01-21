c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision lowp float;uniform float y;float x;
var fragmentShader = `precision lowp float;uniform float y;float x,z;vec3 f;vec2 r,c=vec2(640,360);vec3 s(vec3 v,vec3 y){vec3 r=sin(y),f=cos(y);v=vec3(f.z*v.x-r.z*v.y,r.z*v.x+f.z*v.y,v.z);return vec3(f.y*v.x+r.y*v.z,v.y,-r.y*v.x+f.y*v.z);}float s(vec3 v){return v+=sin(s(v,vec3(y))*2.)*.08,v=s(v,vec3(-y)),z=length(tan(v*20.)/4.),abs(dot(sin(v),cos(v.zxy))-2.8)-1.8;}void main(){r=gl_FragCoord.xy/c.xy*2.-1.;r.x*=c.x/c.y;for(int v=0;v<=64;v++){f=vec3(y/6.2)+normalize(vec3(0.,-.5145,-.8575)+r.x*vec3(-.75,0.,0.)+r.y*vec3(0.,.6443,-.3859))*x;float l=s(f);x+=l;vec2 n=vec2(.1,0.);f=normalize(vec3(s(f+n.xyy)-l,s(f+n.yxy)-l,s(f+n.yyx)-l));}gl_FragColor=vec4(z*f*max(dot(f,vec3(0.,1.,1.)),0.)*vec3(step(-20.,-x)),1.);}`;

a = new AudioContext();
f = requestAnimationFrame;
function createShader(src, type) {
    var shader = g.createShader(type);
    g.shaderSource(shader, src);
    g.compileShader(shader);
    //console.log(g.getShaderInfoLog(shader));
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