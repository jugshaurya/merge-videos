"use strict";
const { join } = require("path");
const { readdirSync, lstatSync } = require("fs");
const videoStitch = require("video-stitch");
const videoConcat = videoStitch.concat;

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

/* get path list of all subdirectories at any depth/level inside @source directory*/
const getAllFolderSubfolderDirs = (source) => {
  if (source.isDirectory()) {
    const directories = [];
    // get all the subdirectories
    const subDirectories = getDirectories(source);
    // for each subdirectory, get a list of subdirectories in [depth first(dfs) fashion]
    subDirectories.forEach((directory) => {
      directories.push(directory);
      directories.push(...getAllFolderSubfolderDirs(directory));
    });
    return directories;
  } else {
    throw new Error("Please give a directory path, not a file path!");
  }
};

function main() {
  /* get the added folder that contains videos inside assets folder */
  const directoryList = getAllFolderSubfolderDirs(join(__dirname, "assets"));

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

  /* retrive the `mp4 or mkv` files from each directory*/
  const files = directoryList.reduce((acc, directory) => {
    const files = getMp4orMkvFiles(directory).sort(sortStringNumerically);
    acc.push(...files);
    return acc;
  }, []);

  // 😁 merge the files together 😁
  videoConcat({
    silent: true,
    overwrite: false,
  })
    .clips(
      files.map((file) => ({
        fileName: file,
      }))
      // TODO: show the progress bar
    )
    .output(join(__dirname, "output", "congrats.mp4"))
    .concat()
    .then((outputFileName) => {
      console.log("Congrats your file is generated inside output folder");
      console.log(outputFileName);
    })
    .catch((err) => {
      console.log("SOmething went wrong so sorry!");
      console.log(err);
    });
}

main();
