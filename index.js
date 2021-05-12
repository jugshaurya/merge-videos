"use strict";
const { join } = require("path");
const { readdirSync, lstatSync } = require("fs");
const videoStitch = require("video-stitch");

const videoConcat = videoStitch.concat;
// const concat = require("ffmpeg-concat");

/* check to see if a @source route is a directory or not*/
const isDirectory = (source) => lstatSync(source).isDirectory();

/* check to see if a @source route is a directory or not*/
const isFile = (source) => lstatSync(source).isFile();

/* filter a @file if it ends with ".mp4 or .mkv"*/
const isMp4OrMkv = (file) =>
  file.substr(file.length - 4) === ".mp4" ||
  file.substr(file.length - 4) === ".mkv";

/* get one level directories inside a @source path */
const getDirectories = (source) =>
  readdirSync(source)
    .map((name) => join(source, name))
    .filter(isDirectory);

/* get one level `mp4 or mkv` files inside a @source path */
const getMp4orMkvFiles = (source) =>
  readdirSync(source)
    .map((name) => join(source, name))
    .filter(isFile)
    .filter(isMp4OrMkv);

const sortStringNumerically = (a, b) => {
  // path will be like x/y/z/1.something.mp4
  // retriving only 1.something and then 1 from it
  // Note: Hence files should be named as 1.something,`where 1 and . are compulsory`
  const alphaSplit = a.split("/");
  const alpha = alphaSplit[alphaSplit.length - 1];
  const bettaSplit = b.split("/");
  const betta = bettaSplit[bettaSplit.length - 1];

  return parseInt(alpha.split(".")[0]) - parseInt(betta.split(".")[0]);
};

/* get path list of all subdirectories at any depth/level inside @source directory*/
const getAllFolderSubfolderDirs = (source) => {
  if (isDirectory(source)) {
    const directories = [];
    // get all the subdirectories
    const subDirectories = getDirectories(source);
    // for each subdirectory, get a list of subdirectories in [depth first(dfs) fashion]
    subDirectories.forEach((directory) => {
      directories.push(directory);
      directories.push(...getAllFolderSubfolderDirs(directory));
    });
    return directories.sort(sortStringNumerically);
  } else {
    throw new Error("Please give a directory path, not a file path!");
  }
};

const mergeVideos = (files) => {
  // TODO: show the progress bar
  videoConcat({
    silent: true, // optional. if set to false, gives detailed output on console
    overwrite: true, // optional. by default, if file already exists, ffmpeg will ask for overwriting in console and that pause the process. if set to true, it will force overwriting. if set to false it will prevent overwriting.
  })
    .clips(
      files.map((file) => ({
        fileName: file,
      }))
    )
    .output(join(__dirname, "output", "congrats.mp4"))
    .concat()
    .then((outputFileName) => {
      console.log("Congrats your file is generated inside output folder");
      console.log(outputFileName);
    })
    .catch((err) => {
      console.log("Something went wrong so sorry!");
      console.log("Error:", err);
    });
};

function main() {
  /* get the added folder that contains videos inside assets folder */
  const directoryList = getAllFolderSubfolderDirs(join(__dirname, "assets"));

  /* retrive the `mp4 or mkv` files from each directory*/
  const files = directoryList.reduce((acc, directory) => {
    const files = getMp4orMkvFiles(directory).sort(sortStringNumerically);
    acc.push(...files);
    return acc;
  }, []);

  // 😁 merge the files together 😁
  console.dir(files, { maxArrayLength: null });
  console.log(
    `\n ✔ ⬆⬆⬆ Merging these files(${files.length}) in the same above list order; please check the order above \n`
  );

  mergeVideos(files);
}

main();
