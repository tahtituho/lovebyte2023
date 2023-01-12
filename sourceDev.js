c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
var vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision highp float;uniform float y;
var fragmentShader = `precision highp float;uniform float y;struct en{float d;vec3 po;vec3 n;vec3 m;};struct ht{float d;en e;};vec2 v;vec3 n(vec3 v,vec3 d){vec3 e=sin(d),y=cos(d),n=vec3(y.z*v.x-e.z*v.y,e.z*v.x+y.z*v.y,v.z),m=vec3(y.y*n.x+e.y*n.z,n.y,-e.y*n.x+y.y*n.z);return vec3(m.x,y.x*m.y-e.x*m.z,e.x*m.y+y.x*m.z);}en n(vec3 d){vec3 e=vec3(75.),m=n(d,vec3(y/2.,y,-y)),x=mod(m+e*.5,e)-e*.5,z=floor((m+e*.5)/e);en h;vec3 i=abs(n(x,vec3(z)+y*2.)+length(sin((v.xy+y)*13.)))-vec3(10.);h.d=min(max(i.x,max(i.y,i.z)),0.)+length(max(i,0.))-.3;h.m=abs(z);return h;}ht e(vec3 y){ht v;for(int e=0;e<=64;e++){vec3 d=vec3(0.,30.,50.)+y*v.d;v.e=n(d);v.d+=v.e.d;if(abs(v.e.d)<.001){vec2 m=vec2(1e-4,0);v.e.n=normalize(vec3(n(d+m.xyy).d-v.e.d,n(d+m.yxy).d-v.e.d,n(d+m.yyx).d-v.e.d));break;}}return v;}void main(){vec2 m=vec2(640,360);v=gl_FragCoord.xy/m.xy*2.-1.;v.x*=m.x/m.y;ht d=e(normalize(vec3(0.,-.5145,-.8575)+v.x*vec3(-.75,0.,0.)+.75*v.y*vec3(0.,.8575,-.5145)));gl_FragColor=vec4(vec3(1.-smoothstep(0.,300.,d.d))*(d.e.m*.05*10.+max(dot(d.e.n,normalize(vec3(0.,100.,10.)-d.e.po)),0.)),1.);}`;

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