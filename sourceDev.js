c = document.body.appendChild(document.createElement("canvas"));
c.width = 640;
c.height = 360;

g = c.getContext("webgl");
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision lowp float;uniform float y;float x;
var fragmentShader = `precision lowp float;uniform float y;float x,z,c;vec3 i,n,d;vec2 r,a,s=vec2(640,360);vec3 t(vec3 v,vec3 i){return n=sin(i),d=cos(i),v=vec3(d.z*v.x-n.z*v.y,n.z*v.x+d.z*v.y,v.z),vec3(d.y*v.x+n.y*v.z,v.y,-n.y*v.x+d.y*v.z);}float t(vec3 v){return v=t(v,vec3(-y)),v+=sin(t(v,vec3(y))*2.)*.1,z=length(tan(v*20.)),abs(dot(sin(v),cos(v.zxy))-3.)-2.;}void main(){r=gl_FragCoord.xy/s.xy*2.-1.;r.x*=s.x/s.y;for(int v=0;v<=64;v++)i=vec3(y/6.2)+normalize(vec3(0.,-.5145,-.8575)+r.x*vec3(-.75,0.,0.)+r.y*vec3(0.,.6443,-.3859))*x,c=t(i),x+=c,a=vec2(.1,0.),i=normalize(vec3(t(i+a.xyy)-c,t(i+a.yxy)-c,t(i+a.yyx)-c));gl_FragColor=vec4(z*i*max(dot(i,vec3(0.,1.,.5)),0.)*vec3(step(x,20.)),1.);}`;

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
    k = a.createBufferSource();
    k.buffer = a.createBuffer(1, q = 22050 * 120, 8000)
    for (t = 0; t < q; t++) {
        //Write here tune
        k.buffer.getChannelData(0)[t] = (
            ((t^(2*t>>3))-(t*("123436"[t>>11&5]&3)))+((t&255&t>>6)+(t&64&t>>8)) 
        & 255) / 127 - 1;
    }

    k.connect(a.destination);
    k.start();

    c.requestFullscreen();
    g.attachShader(p = g.createProgram(), createShader(`void main(){gl_Position=vec4(0.,0.,0.,1.);gl_PointSize=640.;}`, 35633));
    g.attachShader(p, createShader(fragmentShader, 35632));

    g.linkProgram(p);
    g.useProgram(p);

    g.enableVertexAttribArray(0);
    g.bindBuffer(34962, g.createBuffer());
    g.vertexAttribPointer(0, 1, 5126, false, 0, 0);
    f(draw);
}