const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure path aliases using Metro's resolver
config.resolver = {
  ...config.resolver,
  extraNodeModules: new Proxy(
    {},
    {
      get: (target, name) => {
        if (name === '@') {
          return path.resolve(__dirname);
        }
        if (name.startsWith('@/')) {
          const subpath = name.substring(2); // Remove '@/'
          // Handle specific mappings
          const mappings = {
            'src': 'src',
            'core': 'src/core',
            'components': 'components',
            'hooks': 'hooks',
            'services': 'src/services',
            'stores': 'src/stores',
            'utils': 'src/utils',
            'constants': 'constants',
            'types': 'src/types',
            'features': 'src/features',
            'providers': 'src/providers',
          };
          
          for (const [prefix, realPath] of Object.entries(mappings)) {
            if (subpath.startsWith(prefix + '/') || subpath === prefix) {
              return path.resolve(__dirname, realPath);
            }
          }
        }
        return path.join(__dirname, 'node_modules', name);
      },
    }
  ),
};

module.exports = config;

