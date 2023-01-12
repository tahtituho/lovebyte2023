c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
var vertexShader = `attribute vec3 position;void main(){gl_Position = vec4(position, 1.0);}`;
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision highp float;uniform float y;
var fragmentShader = `precision highp float;uniform float y;struct en{float d;vec3 n;vec3 m;};struct ht{float d;en e;};vec2 e;vec3 v(vec3 e,vec3 d){vec3 v=sin(d),y=cos(d),m=vec3(y.z*e.x-v.z*e.y,v.z*e.x+y.z*e.y,e.z),n=vec3(y.y*m.x+v.y*m.z,m.y,-v.y*m.x+y.y*m.z);return vec3(n.x,y.x*n.y-v.x*n.z,v.x*n.y+y.x*n.z);}en v(vec3 d){vec3 m=vec3(75.),n=v(d,vec3(y/2.,y,-y)),x=mod(n+m*.5,m)-m*.5,z=floor((n+m*.5)/m);en h;vec3 i=abs(v(x,vec3(z)+y*2.)+length(sin((e.xy+y)*13.)))-vec3(10.);h.d=min(max(i.x,max(i.y,i.z)),0.)+length(max(i,0.))-.3;h.m=abs(z);return h;}ht n(vec3 y){ht e;for(int d=0;d<=64;d++){vec3 n=vec3(0.,30.,50.)+y*e.d;e.e=v(n);e.d+=e.e.d;if(abs(e.e.d)<.001){vec2 m=vec2(.001,0);e.e.n=normalize(vec3(v(n+m.xyy).d-e.e.d,v(n+m.yxy).d-e.e.d,v(n+m.yyx).d-e.e.d));break;}}return e;}void main(){vec2 m=vec2(640,360);e=gl_FragCoord.xy/m.xy*2.-1.;e.x*=m.x/m.y;ht v=n(normalize(vec3(0.,-.5145,-.8575)+e.x*vec3(-.75,0.,0.)+.75*e.y*vec3(0.,.8575,-.5145)));gl_FragColor=vec4(vec3(1.-smoothstep(0.,300.,v.d))*(v.e.m*.5+max(dot(v.e.n,vec3(0.,1.,.1)),0.)),1.);}`;

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