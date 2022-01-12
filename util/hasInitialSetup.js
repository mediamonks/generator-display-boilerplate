module.exports = function hasInitialSetup(ctx) {
  if (!ctx.fs.exists(ctx.destinationPath('package.json'))) {
    return false;
  }

  const json = ctx.fs.readJSON(ctx.destinationPath('package.json'));

  if (!json || !json.dependencies || !json.scripts) {
    return false;
  }

  if (
    !json.dependencies['@mediamonks/display-dev-server'] ||
    !json.scripts.dev ||
    !json.scripts.build
  ) {
    return false;
  }

  return true;
};
