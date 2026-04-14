/** @type {import('next').NextConfig} */
const nextConfig = {
  // msedge-tts uses the `ws` WebSocket library which has an optional native
  // C++ addon (bufferutil). When webpack tries to bundle it the addon breaks.
  // Solution: exclude all three packages from bundling entirely so Node.js
  // loads them directly at runtime.
  serverExternalPackages: ['msedge-tts', 'ws', 'bufferutil', 'utf-8-validate', '@vitalets/google-translate-api'],

  webpack: (config) => {
    // Also mark as webpack externals — belt-and-suspenders approach
    config.externals = [
      ...(config.externals || []),
      { canvas: 'canvas', bufferutil: 'bufferutil', 'utf-8-validate': 'utf-8-validate' },
    ];
    return config;
  },
};

module.exports = nextConfig;
