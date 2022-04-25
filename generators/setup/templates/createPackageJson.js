module.exports = function createPackageJson({ name = 'display-temple' }) {
  return {
    name,
    version: '1.0.0',
    description: '',
    homepage: '',
    author: '',
    engines: {
      npm: '>= 14.9.0',
    },
    scripts: {
      dev: "dds-dev",
      build: "dds-build",
      preview: 'display-upload',
    },
    license: 'ISC',
    dependencies: {
      "@mediamonks/display-dev-server": "^9.3.6",
      "@mediamonks/display-temple": "^6.2.0",
      "@mediamonks/display-upload": "^1.5.7",
      "webfontloader": "^1.6.28"
    },
  };
};
