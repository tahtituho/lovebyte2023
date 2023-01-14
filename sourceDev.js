c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
var vertexShader = `attribute vec3 p;void main(){gl_Position = vec4(p, 1.0);}`;
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision precision highp float;uniform float y;float x;
var fragmentShader = `precision highp float;uniform float y;float x;vec3 z,r;vec2 m;vec3 s(vec3 v,vec3 y){vec3 m=sin(y),r=cos(y),x=vec3(r.z*v.x-m.z*v.y,m.z*v.x+r.z*v.y,v.z),s=vec3(r.y*x.x+m.y*x.z,x.y,-m.y*x.x+r.y*x.z);return vec3(s.x,r.x*s.y-m.x*s.z,m.x*s.y+r.x*s.z);}float s(vec3 v){vec3 x=vec3(75.),r=s(v,vec3(y/2.,y,-y)),i=mod(r+x*.5,x)-x*.5,d=floor((r+x*.5)/x),e=abs(s(i,vec3(d)+y*2.)+length(sin((m.xy+y)*13.)))-vec3(10.);z=abs(d);return min(max(e.x,max(e.y,e.z)),0.)+length(max(e,0.))-2.;}void main(){vec2 v=vec2(640,360);m=gl_FragCoord.xy/v.xy*2.-1.;m.x*=v.x/v.y;for(int y=0;y<=64;y++){vec3 d=vec3(0.,30.,50.)+normalize(vec3(0.,-.5145,-.8575)+m.x*vec3(-.75,0.,0.)+m.y*vec3(0.,.6443,-.3859))*x;float e=s(d);x+=e;if(e<.001){vec2 i=vec2(.001,0);r=normalize(vec3(s(d+i.xyy)-e,s(d+i.yxy)-e,s(d+i.yyx)-e));break;}}gl_FragColor=vec4(vec3(smoothstep(300.,0.,x))*(z*.5+max(dot(r,vec3(0.,1.,.1)),0.)),1.);}`;

function createShader(src, type) {
    var shader = g.createShader(type);
    g.shaderSource(shader, src);
    g.compileShader(shader);
    return shader;
}

function draw(time) {  
    g.vertexAttribPointer(0, 2, 5126, false, 0, 0);
    g.enableVertexAttribArray(0);
  
    g.uniform1f(g.getUniformLocation(p, "y"), time / 1000);
    g.drawArrays(5, 0, 4);
    requestAnimationFrame(draw);
}

V.onclick = _ => {
    var audioContext = new AudioContext();
    var soundBuffer = audioContext.createBuffer(1, q = 22050 * 30, 44000);

    for (t = 0; t < q; t++) {
        //This tune is ripped from https://greggman.com/downloads/examples/html5bytebeat/html5bytebeat.htm
        //ryg 2011-10-10 (44k)
        //Write here tune
        soundBuffer.getChannelData(0)[t] = (
            ((t*("36364689"[t>>13&7]&15))/12&128)+(((((t>>12)^(t>>12)-2)%11*t)/4|t>>13)&127)
        & 255) / 127 - 1;
    }

    var soundSource = audioContext.createBufferSource();
    
    soundSource.buffer = soundBuffer;
    soundSource.connect(audioContext.destination);
    soundSource.start();

    c.requestFullscreen();
    c.style.cursor = 'none';
    c.onclick = null;

    g.bindBuffer(ab = 34962, g.createBuffer());
    g.bufferData(ab, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), 35044);

    g.attachShader(p = g.createProgram(), createShader(vertexShader, 35633));
    g.attachShader(p, createShader(fragmentShader, 35632));

    g.linkProgram(p);
    g.useProgram(p);
    requestAnimationFrame(draw);
}