module.exports = function hasInitialSetup(ctx) {
  try {
    // Only check if package.json exists when we're in the action phase
    if (ctx && ctx.fs && ctx.destinationPath) {
      if (!ctx.fs.exists(ctx.destinationPath('package.json'))) {
        return false;
      }

      const json = ctx.fs.readJSON(ctx.destinationPath('package.json'));
      if (!json || !json.dependencies || !json.scripts) {
        return false;
      }

      return true;
    }
    return true; // Return true during initialization
  } catch (error) {
    return true; // Return true if we can't check yet
  }
};
