import { minify } from "terser";
//read sourceDev.js and minify it
const run = async (code) => {
    const minified = await minify(code);
    return minified.code;
    
};
const code = run();
code.then(minifed => {
    console.log(minifed);
});