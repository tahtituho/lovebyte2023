d = document;
c = d.body.appendChild(d.createElement("canvas"));
c.width = 1280;
c.height = 720;

g = c.getContext("webgl");

for (i in g) {
    g[i[0] + i[6]] = g[i];
}
//Remember to change time to be uniform float y and resolution to 640x360
//First two lines should be like precision lowp float;uniform float y;float x;
var fragmentShader = `precision lowp float;uniform float y;float x,z,c;vec3 i,n,s;vec2 r,a,d=vec2(1280,720);vec3 t(vec3 v,vec3 i){return n=sin(i),s=cos(i),v=vec3(s.z*v.x-n.z*v.y,n.z*v.x+s.z*v.y,v.z),vec3(s.y*v.x+n.y*v.z,v.y,-n.y*v.x+s.y*v.z);}float t(vec3 v){return v=t(v,vec3(-y))+sin(t(v,vec3(y))*2.)*.15,z=length(tan(v*20.)),abs(dot(sin(v),cos(v.zxy))-3.)-2.;}void main(){r=(2.*gl_FragCoord.xy-d)/d.y;for(int v=0;v<=64;v++)i=vec3(y/6.2)+normalize(vec3(0.,-.5145,-.8575)+r.x*vec3(-.75,0.,0.)+r.y*vec3(0.,.6443,-.3859))*x,c=t(i),x+=c,a=vec2(.15,0.),i=normalize(vec3(t(i+a.xyy)-c,t(i+a.yxy)-c,t(i+a.yyx)-c));gl_FragColor=vec4(z*i*max(dot(i,vec3(0.,1.,.5)),0.)*vec3(step(x,20.)),1.);}`;

a = new AudioContext();
for (i in a) {
    a[i[6]] = a[i];
}

f = requestAnimationFrame;

cs = (src, type, shader = g.cS(type)) => {
    g.sS(shader, src);
    g.compileShader(shader);
    return shader;
}

d = () => {  
    g.uniform1f(g.gf(p, "y"), a.currentTime / 2);
    g.dr(6, 0, 3);
    f(d);
}

c.onclick = _ => {
    c.requestFullscreen();
    k = a.B();
    k.buffer = a.createBuffer(1, q = 4000 * 120, 8000)
    for (t = q; t--;) {
        //Write here tune
        k.buffer.getChannelData(0)[t] = (
            ((t^(2*t>>3))-(t*("123436"[t>>11&5]&3)))+((t&255&t>>6)+(t&64&t>>8)) 
        & 255) / 127 - 1;
    }
    k.connect(a.a);
    k.start();


    g.aS(p = g.cP(), cs(`attribute vec4 p;void main(){gl_Position=p;}`, 35633));
    g.aS(p, cs(fragmentShader, 35632));

    g.lo(p);

    g.vA(g.ug(p), 2, 5120, g.bf(34962, g.cB()), 1, g.bD(34962, new Int8Array(m = [1, -3, 1, 1]), 35044));
    g.eV(0);
    f(d);
}