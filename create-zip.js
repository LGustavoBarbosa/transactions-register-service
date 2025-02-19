const fs = require("fs");
const archiver = require("archiver");

const output = fs.createWriteStream("lambda_function_payload.zip");
const archive = archiver("zip", {
  zlib: { level: 9 }, // Maximum compression
});

output.on("close", function () {
  console.log(archive.pointer() + " total bytes");
  console.log(
    "archiver has been finalized and the output file descriptor has closed."
  );
});

archive.on("warning", function (err) {
  if (err.code === "ENOENT") {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);

archive.directory("dist/", "dist");
archive.directory("node_modules/", "node_modules");
archive.finalize();
