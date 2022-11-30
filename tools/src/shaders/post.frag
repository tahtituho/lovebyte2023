#version 400
uniform sampler2D o;
out vec4 i;
vec2 resolution = vec2(1280.0, 720.0);


void main() {
	vec2 uv = ((gl_FragCoord.xy) / resolution);
	i = vec4(texture(o, uv).rgb, 1.0);
}
