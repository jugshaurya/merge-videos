"use strict";
const path = require("path");
const videoStitch = require("video-stitch");
// const videoConcat = videoStitch.concat;

// const folderToReadPath = process.argv.slice(2)[0];
const fs = require("fs");

// steps
// 1. move videos inside assets folder - DONE
// 2. get all the mp4/mkv files names to be merged into one in order mentioned by initial video number (1.something, 2.somethingmore .....)

const isDirectory = (source) => fs.lstatSync(source).isDirectory();
const isFile = (source) => fs.lstatSync(source).isFile();

const getDirectories = (source) =>
  fs
    .readdirSync(source)
    .map((name) => path.join(source, name))
    .filter(isDirectory);

const isMp4OrMkv = (file) =>
  file.substr(file.length - 4) === ".mp4" ||
  file.substr(file.length - 4) === ".mkv";

console.log(isMp4OrMkv("sadsadsad.mp4"));
const getMp4orMkvFiles = (source) =>
  fs
    .readdirSync(source)
    .map((name) => path.join(source, name))
    .filter(isFile)
    .filter(isMp4OrMkv);

const getAllFolderSubfolderDirs = (rootPath) => {
  const directories = [];
  const subDirectories = getDirectories(rootPath);
  subDirectories.forEach((directory) => {
    directories.push(directory);

    directories.push(...getAllFolderSubfolderDirs(directory));
  });
  return directories;
};

const pathToVideosFolder = path.join(__dirname, "assets");
const allDirectories = getAllFolderSubfolderDirs(pathToVideosFolder);
// console.log(allDirectories);

// 3. get all the files names in a list

const files = allDirectories.reduce((acc, directory) => {
  const files = getMp4orMkvFiles(directory).sort((a, b) => {
    const splittedString = a.split("/");
    const alpha = splittedString[splittedString.length - 1];

    const splittedStringb = b.split("/");
    const betta = splittedStringb[splittedStringb.length - 1];
    return parseInt(alpha.split(".")[0]) - parseInt(betta.split(".")[0]);
  });
  acc.push(...files);
  return acc;
}, []);

console.log(files);
const list = [
  "alpha/1.q",
  "alpha/10. sad",
  "alpha/11.aewqe",
  "alpha/12.saw",
  "alpha/13.wrer",
  "alpha/14.asd",
  "alpha/15.wqe",
  "alpha/16.sad",
  "alpha/17.awq",
  "alpha/2.as23",
  "alpha/3.dvc",
  "alpha/4.fgg",
  "alpha/5.fgh",
  "alpha/6.wqe",
  "alpha/7.waqewq",
  "alpha/8.wqawq",
  "alpha/9.oip",
].sort((a, b) => {
  const splittedString = a.split("/");
  const alpha = splittedString[splittedString.length - 1];

  const splittedStringb = b.split("/");
  const betta = splittedStringb[splittedStringb.length - 1];
  return parseInt(alpha.split(".")[0]) - parseInt(betta.split(".")[0]);
});

// const splittedString = a.split("/");
// const alpha = a.substr(splittedString.length - 1);
// console.log(alpha);
console.log(list);
// console.log(files);
// videoConcat({
//   silent: true,
//   overwrite: false,
// })
//   .clips([
//     {
//       fileName: path.join(
//         __dirname,
//         "assets",
//         "1. What is a Regular Expression.mp4"
//       ),
//     },
//     {
//       fileName: path.join(
//         __dirname,
//         "assets",
//         "2. Regular Expression Readability.mp4"
//       ),
//     },
//   ])
//   .output(path.join(__dirname, "assets", "ouou.mp4"))
//   .concat()
//   .then((outputFileName) => {
//     console.log("sad");
//     console.log(outputFileName);
//   })
//   .catch((err) => {
//     console.log("saderr");
//     console.log(err);
//   });
