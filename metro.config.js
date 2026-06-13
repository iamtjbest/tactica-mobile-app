const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .cjs extension used by the Firebase SDK
config.resolver.sourceExts.push('cjs');

// Disable unstable package exports which conflicts with Firebase modules
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
