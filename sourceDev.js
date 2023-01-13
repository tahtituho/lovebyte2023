c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
var vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision precision highp float;uniform float y;float x;
var fragmentShader = `precision highp float;uniform float y;float x;vec3 z,r;vec2 m;vec3 n(vec3 v,vec3 y){vec3 m=sin(y),r=cos(y),x=vec3(r.z*v.x-m.z*v.y,m.z*v.x+r.z*v.y,v.z),z=vec3(r.y*x.x+m.y*x.z,x.y,-m.y*x.x+r.y*x.z);return vec3(z.x,r.x*z.y-m.x*z.z,m.x*z.y+r.x*z.z);}float n(vec3 v){vec3 x=vec3(75.),r=n(v,vec3(y/2.,y,-y)),i=mod(r+x*.5,x)-x*.5,s=floor((r+x*.5)/x),d=abs(n(i,vec3(s)+y*2.)+length(sin((m.xy+y)*13.)))-vec3(10.);z=abs(s);return min(max(d.x,max(d.y,d.z)),0.)+length(max(d,0.))-.3;}void main(){vec2 v=vec2(640,360);m=gl_FragCoord.xy/v.xy*2.-1.;m.x*=v.x/v.y;for(int y=0;y<=64;y++){vec3 s=vec3(0.,30.,50.)+normalize(vec3(0.,-.5145,-.8575)+m.x*vec3(-.75,0.,0.)+m.y*vec3(0.,.6443,-.3859))*x;float d=n(s);x+=d;if(d<.001){vec2 i=vec2(.001,0);r=normalize(vec3(n(s+i.xyy)-d,n(s+i.yxy)-d,n(s+i.yyx)-d));break;}}gl_FragColor=vec4(vec3(1.-smoothstep(0.,300.,x))*(z*.5+max(dot(r,vec3(0.,1.,.1)),0.)),1.);}`;

function createShader(src, type) {
    var shader = g.createShader(type);
    g.shaderSource(shader, src);
    g.compileShader(shader);
    return shader;
}

function draw(time) {  
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    g.enableVertexAttribArray(0);
  
    g.uniform1f(g.getUniformLocation(p, "y"), time / 1000);
    g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
};

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

    var ab = g.ARRAY_BUFFER;
    g.bindBuffer(ab, g.createBuffer());
    g.bufferData(ab, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), g.STATIC_DRAW);

    g.attachShader(p = g.createProgram(), createShader(vertexShader, g.VERTEX_SHADER));
    g.attachShader(p, createShader(fragmentShader, g.FRAGMENT_SHADER));

    g.linkProgram(p);
    g.useProgram(p);
    requestAnimationFrame(draw);
};