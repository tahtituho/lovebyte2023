d = document;
c = d.body.appendChild(d.createElement("canvas"));
c.width = 1280;
c.height = 720;

g = c.getContext("webgl");

for (i in g) {
    g[i[0] + i[6]] = g[i];
}
//Remember to change time to be uniform float y
//First two lines should be like precision lowp float;uniform float y;float x,z,c;
var fragmentShader = `precision lowp float;uniform float y;float x,z,c;vec3 s,n,d;vec2 r,a,e=vec2(1280,720);vec3 t(vec3 v,vec3 y){return n=sin(y),d=cos(y),v=vec3(d.z*v.x-n.z*v.y,n.z*v.x+d.z*v.y,v.z),vec3(d.y*v.x+n.y*v.z,v.y,-n.y*v.x+d.y*v.z);}float t(vec3 v){return v=t(v,vec3(-y))+sin(t(v,vec3(y))*2.)*.15,z=length(tan(v*20.+y*20.))*smoothstep(22.5,20.,y),abs(dot(sin(v),cos(v.zxy))-3.)-2.;}void main(){r=(2.*gl_FragCoord.xy-e)/e.y;for(int v=0;v<=64;v++)s=vec3(y/6.2)+normalize(vec3(0.,-.5145,-.8575)+r.x*vec3(-.75,0.,0.)+r.y*vec3(0.,.6443,-.3859))*x,c=t(s),x+=c,a=vec2(.15,0.),s=normalize(vec3(t(s+a.xyy)-c,t(s+a.yxy)-c,t(s+a.yyx)-c));gl_FragColor=vec4(z*s*max(dot(s,vec3(0.,1.,.5)),0.)*vec3(step(x,20.)),1.);}`;

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
    k.buffer = a.createBuffer(1, q = 8000 * 45, 8000)
    for (t = q; t--;) {
        //Write here tune
        k.buffer.getChannelData(0)[t] = (
            ("34"[t>>8&t])*70.0|((t^(t>>50))-(t&(t>>5))-(t^(2*t>>3)))
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