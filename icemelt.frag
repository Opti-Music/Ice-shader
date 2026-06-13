#pragma header

// Psych Engine uniforms
uniform float iTime;
uniform vec3 iResolution;
uniform float progress; // 0.0 = normal screen, 1.0 = fully melted/invisible

// Simple hash function to generate procedural noise vectors
float hash(float x) {
    return fract(sin(x) * 43758.5453123);
}

void main() {
    vec2 uv = openfl_TextureCoordv;
    
    // Generate unique vertical melting speeds for different screen columns
    float xColumn = floor(uv.x * iResolution.x / 4.0); // Split screen into thin vertical icicle strips
    float meltDelay = hash(xColumn); // Each column starts melting at a slightly different time
    
    // Calculate the melt distortion amount for this specific pixel column
    float meltForce = max(0.0, progress * 1.5 - meltDelay * 0.5);
    
    // Distort the Y coordinate downward exponentially
    vec2 distortedUV = uv;
    distortedUV.y -= pow(meltForce, 2.0) * 0.75;
    
    // Sample the screen texture with the melted coordinates
    vec4 sceneColor = flixel_texture2D(bitmap, distortedUV);
    
    // Give the melting edges a frozen, icy blue/white tint
    if (distortedUV.y < 0.0) {
        // If the pixel has melted off the screen, replace it with an icy color or transparency
        float iceGlow = clamp(1.0 + distortedUV.y * 5.0, 0.0, 1.0);
        vec4 iceColor = vec4(0.6, 0.8, 1.0, 1.0); // Light blue ice color
        sceneColor = mix(vec4(0.0), iceColor, iceGlow);
    } else if (distortedUV.y < 0.05 * meltForce) {
        // Add a frost highlight tip to the melting edge
        sceneColor += vec4(0.2, 0.4, 0.6, 0.0) * (1.0 - (distortedUV.y / (0.05 * meltForce)));
    }
    
    gl_FragColor = sceneColor;
}
