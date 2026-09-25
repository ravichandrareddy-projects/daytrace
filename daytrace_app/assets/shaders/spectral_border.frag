#include <flutter/runtime_effect.glsl>

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

out vec4 fragColor;

// Smooth cyclical spectral rainbow palette (matching the Stitch generation border flow)
vec3 spectralPalette(float t) {
    // Elegant luminous spectrum: cyan -> blue -> violet -> magenta -> peach -> yellow -> mint -> cyan
    vec3 a = vec3(0.68, 0.72, 0.78);
    vec3 b = vec3(0.38, 0.35, 0.38);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.33, 0.67);
    return a + b * cos(6.2831853 * (c * t + d));
}

// Distance to rounded rectangle boundary
float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + vec2(r);
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
    vec2 fragCoord = FlutterFragCoord();
    vec2 uv = fragCoord.xy / u_resolution.xy;
    
    // Aspect ratio correction
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = uv - 0.5;
    p.x *= aspect;

    vec2 halfSize = vec2(0.5 * aspect, 0.5);

    // Porcelain crisp white base background (#FAF9FE)
    vec3 baseColor = vec3(0.982, 0.980, 0.995);

    // Border perimeter metrics
    float cornerRadius = 0.08 * aspect;
    float d = roundedBoxSDF(p, halfSize - vec2(0.005 * aspect, 0.005), cornerRadius);

    // Distance from the outer edge inward
    float distFromEdge = max(-d, 0.0);

    // Continuous flow coordinate: sweeping from left to right along horizontal & wrapping edges
    float flowSpeed = 0.22;
    float flow = fract(uv.x * 0.85 - uv.y * 0.15 - u_time * flowSpeed);

    // Spectral color from the moving wave
    vec3 rainbowCol = spectralPalette(flow);

    // Edge glow thickness: concentrated in outer 35-65px (feathered inward)
    float edgeGlow = smoothstep(0.18, 0.002, distFromEdge);
    
    // Extra concentration along bottom border and corners
    float bottomConcentration = smoothstep(0.4, 0.98, uv.y) * 1.4;
    float topConcentration = smoothstep(0.15, 0.0, uv.y) * 0.5;
    float sideConcentration = (smoothstep(0.12, 0.0, uv.x) + smoothstep(0.88, 1.0, uv.x)) * 0.8;
    
    float totalEdgeWeight = edgeGlow * (0.85 + bottomConcentration + sideConcentration + topConcentration);

    // Subtle inner ambient reflection: soft diffuse haze drifting across bottom-mid
    float ambientHaze = smoothstep(0.45, 0.0, length(uv - vec2(0.5, 0.85))) * 0.18;

    // Intensity calibration
    float finalAlpha = clamp(totalEdgeWeight * 0.55 + ambientHaze, 0.0, 0.88);

    // Compose final pixel
    vec3 finalColor = mix(baseColor, rainbowCol, finalAlpha);

    fragColor = vec4(finalColor, 1.0);
}
