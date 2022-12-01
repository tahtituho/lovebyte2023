1. Edit tools/src/shaders/fragment.frag
1. Run tools/out/leviathan-debug.exe

When shader is finished minify it with shader_minifier.exe by running minifyShader.bat.

After that put minifed shader code to source.js file into fragmentShader variable. Remove #version 400 and out vec4 FragColor. Change from the end FragColor to gl_FragColor.