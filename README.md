# lovebyte 2023 entry by tähtituho
## Shader development
1. Edit tools/src/shaders/fragment.frag
1. Run tools/out/leviathan-debug.exe

## Releasing
1. When shader is finished minify it with shader_minifier.exe by running minifyShader.bat.
1. Start http server: python -m http.server 
1. Put minifed shader code to sourceDev.js file into fragmentShader variable.
1. Point browser to http://localhost:8000/index.html
1. When you feel that everything is working paste sourceDev.js to https://try.terser.org/ and copy output to source.js
1. Run minifyCode.bat and try results at http://localhost:8000/release/index.html
