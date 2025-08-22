const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add font file extensions to asset extensions
config.resolver.assetExts = [...config.resolver.assetExts, 'ttf', 'otf', 'woff', 'woff2'];

module.exports = config;