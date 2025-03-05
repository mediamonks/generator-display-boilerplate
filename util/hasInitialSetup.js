module.exports = function hasInitialSetup(ctx) {
  // During instantiation, ctx might not be fully initialized
  if (!ctx || !ctx.fs || !ctx.destinationPath) {
    return true;
  }

  try {
    // Check if package.json exists
    const hasPackageJson = ctx.fs.exists(ctx.destinationPath('package.json'));
    if (!hasPackageJson) {
      return false; // Allow continuation, setup will handle this
    }

    // Try to read package.json
    const json = ctx.fs.readJSON(ctx.destinationPath('package.json'));
    
    // Basic validation
    if (!json || !json.dependencies || !json.scripts) {
      return false; // Allow continuation, setup will handle this
    }

    // Check for required dependencies
    return !!(
      json.dependencies['@mediamonks/display-dev-server'] &&
      json.scripts.dev &&
      json.scripts.build
    );
  } catch (error) {
    // If any error occurs during check, allow continuation
    return false;
  }
};