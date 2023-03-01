module.exports = function createPackageJson({ name = 'display-temple' }) {
  return {
    name,
    version: '1.0.0',
    description: '',
    homepage: '',
    author: '',
    engines: {
      node: '>= 16',
      npm: '>= 8',
    },
    scripts: {
      dev: "dds --mode development",
      build: "dds --mode production",
      preview: 'display-upload',
    },
    license: 'ISC',
    dependencies: {
      "@mediamonks/display-dev-server": "^11.0.5",
      "@mediamonks/display-temple": "^6.2.6",
      "@mediamonks/display-upload": "^1.6.2",
      "webfontloader": "^1.6.28"
    },
  };
};
