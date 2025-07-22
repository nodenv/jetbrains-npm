#!/usr/bin/env node

var child_process = require("child_process");
var fs = require("fs");
var path = require("path");

child_process.exec("nodenv root", function (err, stdout, stderr) {
  var npm;

  // get shim path from `nodenv root` (respects $NODENV_ROOT)
  if (!err && stdout) {
    npm = npmShim(stdout.replace(/\n/g, ""));
  }

  // infer shim path if installed as nodenv plugin
  if (!npm && path.basename(path.resolve(__dirname + "/../..")) === "plugins") {
    npm = npmShim(path.resolve(__dirname + "/../../.."));
  }

  // fallback to npm from PATH if not found thus far
  child_process
    .spawn(npm || "npm", process.argv.slice(2), { stdio: "inherit" })
    .on("close", process.exit);
});

function npmShim(nodenvRoot) {
  var npmShim = nodenvRoot + "/shims/npm";
  if (fs.existsSync(npmShim)) return npmShim;
}
