const {getDefaultConfig} = require('expo/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  server: {
    port: 8091,
  },
};

module.exports = getDefaultConfig(__dirname, config);
