"use strict";
const path = require("path");
const videoStitch = require("video-stitch");
const videoConcat = videoStitch.concat;

videoConcat({
  silent: true,
  overwrite: false,
})
  .clips([
    {
      fileName: path.join(
        __dirname,
        "assets",
        "1. What is a Regular Expression.mp4"
      ),
    },
    {
      fileName: path.join(
        __dirname,
        "assets",
        "2. Regular Expression Readability.mp4"
      ),
    },
  ])
  .output(path.join(__dirname, "assets", "ouou.mp4"))
  .concat()
  .then((outputFileName) => {
    console.log("sad");
    console.log(outputFileName);
  })
  .catch((err) => {
    console.log("saderr");
    console.log(err);
  });
