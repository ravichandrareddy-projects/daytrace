#include <flutter/runtime_effect.glsl>

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

out vec4 fragColor;

// Simplex-style 2D noise for organic fluid aurora ribbons
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Distance to rounded rectangle boundary
float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + vec2(r);
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

// Aurora Borealis Night Spectral Palette: Emerald cyan -> Electric emerald -> Mystic teal -> Indigo violet -> Deep magenta / purple
vec3 auroraPalette(float t) {
    vec3 cEmerald = vec3(0.0, 0.96, 0.65);     // 00F5A6 vibrant polar green
    vec3 cTeal    = vec3(0.05, 0.82, 0.88);    // 0DD1E0 glacial cyan
    vec3 cIndigo  = vec3(0.38, 0.38, 0.96);    // 6161F5 deep polar violet
    vec3 cMagenta = vec3(0.72, 0.22, 0.85);    // B838D9 nocturnal magenta
    
    float p = fract(t);
    if (p < 0.25) {
        return mix(cEmerald, cTeal, p / 0.25);
    } else if (p < 0.50) {
        return mix(cTeal, cIndigo, (p - 0.25) / 0.25);
    } else if (p < 0.75) {
        return mix(cIndigo, cMagenta, (p - 0.50) / 0.25);
    } else {
        return mix(cMagenta, cEmerald, (p - 0.75) / 0.25);
    }
}

void main() {
    vec2 fragCoord = FlutterFragCoord();
    vec2 uv = fragCoord.xy / u_resolution.xy;

    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = uv - 0.5;
    p.x *= aspect;

    vec2 halfSize = vec2(0.5 * aspect, 0.5);

    // OLED nocturnal pitch-dark night sky base (#0B0E14)
    vec3 baseNight = vec3(0.043, 0.055, 0.078);

    // Perimeter boundary distance
    float cornerRadius = 0.08 * aspect;
    float d = roundedBoxSDF(p, halfSize - vec2(0.005 * aspect, 0.005), cornerRadius);
    float distFromEdge = max(-d, 0.0);

    // Continuous left-to-right & edge wave coordinate
    float flowSpeed = 0.20;
    float t = u_time * flowSpeed;

    // Organic wavy ribbon distortion along the edges
    float noiseCurtain = snoise(vec2(uv.x * 3.2 - t * 0.8, uv.y * 2.5 + t * 0.4)) * 0.06;
    float flowCoord = fract(uv.x * 0.80 - uv.y * 0.18 - t + noiseCurtain);

    // Pure Aurora Night color spectrum
    vec3 auroraCol = auroraPalette(flowCoord);

    // Glow profile: hugging the outer perimeter and blooming around the bottom & bottom corners
    float edgeGlow = smoothstep(0.19, 0.002, distFromEdge + noiseCurtain * 0.5);

    // Enhanced concentration on bottom border and corners
    float bottomConcentration = smoothstep(0.40, 0.98, uv.y) * 1.5;
    float topConcentration = smoothstep(0.12, 0.0, uv.y) * 0.6;
    float sideConcentration = (smoothstep(0.12, 0.0, uv.x) + smoothstep(0.88, 1.0, uv.x)) * 0.9;

    float totalEdgeWeight = edgeGlow * (0.85 + bottomConcentration + sideConcentration + topConcentration);

    // Very subtle atmospheric midnight veil drifting across lower center
    float ambientAuroraVeil = smoothstep(0.45, 0.0, length(uv - vec2(0.5, 0.82))) * 0.22;

    // Luminous intensity on dark background (vivid aurora glow)
    float finalAlpha = clamp(totalEdgeWeight * 0.85 + ambientAuroraVeil, 0.0, 0.95);

    // Mix final color
    vec3 finalColor = mix(baseNight, auroraCol, finalAlpha);

    fragColor = vec4(finalColor, 1.0);
}
