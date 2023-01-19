# lovebyte 2023 entry by tähtituho
## Prerequisites
1. *install node*
1. *run npm install -g http-server*
1. *npm install node-zopfli*
## Shader development
1. Edit *tools/src/shaders/fragment.frag*
1. Run *tools/out/leviathan-debug.exe*
1. leviathan will reload shader when you save it

## Releasing
1. When shader is finished minify it by running *minifyShader.bat*.
1. Start http server in project root folder: *http-server* 
1. Put minifed shader code to *sourceDev.js* file into fragmentShader variable.
1. Make changes to minified shader, these changes are states in *sourceDev.js*
1. Point browser to http://localhost:8080/index.html
1. When you feel that everything is working paste *sourceDev.js* to https://xem.github.io/terser-online/ and copy output to source.js
    1. Also might be good idea to try different minifications: https://js1024.fun/ 
1. Run *minifyCode.bat* and try results at http://localhost:8080/release/index.html
