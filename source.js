c=document.body.appendChild(document.createElement("canvas")),c.width=640,c.height=360,g=c.getContext("webgl");function e(e,r){var t=g.createShader(r);return g.shaderSource(t,e),g.compileShader(t),t}function r(){g.uniform1f(g.getUniformLocation(p,"y"),a.currentTime),g.drawArrays(0,0,1),f(r)}a=new AudioContext,f=requestAnimationFrame,c.onclick=n=>{var o=a.createBuffer(1,q=661500,44e3);for(t=0;t<q;t++)o.getChannelData(0)[t]=((t*(15&"36364689"[t>>13&7])/12&128)+(127&((t>>12^(t>>12)-2)%11*t/4|t>>13))&255)/127-1;k=a.createBufferSource(),k.buffer=o,k.connect(a.destination),k.start(),c.requestFullscreen(),c.style.cursor="none",g.attachShader(p=g.createProgram(),e("void main(){gl_Position=vec4(0.,0.,0.,1.);gl_PointSize=700.;}",35633)),g.attachShader(p,e("precision lowp float;uniform float y;float x;vec3 m,r;vec2 f;vec3 n(vec3 v,vec3 y){vec3 f=sin(y),m=cos(y),x=vec3(m.z*v.x-f.z*v.y,f.z*v.x+m.z*v.y,v.z),r=vec3(m.y*x.x+f.y*x.z,x.y,-f.y*x.x+m.y*x.z);return vec3(r.x,m.x*r.y-f.x*r.z,f.x*r.y+m.x*r.z);}float n(vec3 v){vec3 x=vec3(75.);v=n(v,vec3(y/2.,y,-y));vec3 r=floor((v+x*.5)/x);m=abs(r+sin(y));r=abs(n(mod(v+x*.5,x)-x*.5,vec3(r)+y*2.)+length(sin((f.xy+y)*13.)))-vec3(10.);return min(max(r.x,max(r.y,r.z)),0.)+length(max(r,0.))-2.;}void main(){vec2 v=vec2(640,360);f=gl_FragCoord.xy/v.xy*2.-1.;f.x*=v.x/v.y;for(int l=0;l<=64;l++){vec3 z=vec3(25.,30.,y*3.)+normalize(vec3(0.,-.5145,-.8575)+f.x*vec3(-.75,0.,0.)+f.y*vec3(0.,.6443,-.3859))*x;float a=n(z);x+=a;vec2 i=vec2(.001,0);r=normalize(vec3(n(z+i.xyy)-a,n(z+i.yxy)-a,n(z+i.yyx)-a));}gl_FragColor=vec4(vec3(smoothstep(300.,0.,x))*(m+max(dot(r,vec3(0.,1.,.1)),0.)),1.);}",35632)),g.linkProgram(p),g.useProgram(p),g.enableVertexAttribArray(0),g.bindBuffer(34962,g.createBuffer()),g.vertexAttribPointer(0,1,5126,!1,0,0),f(r)}