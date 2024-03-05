/*
frontend server
server HTML,CSS and frontend js

use ejs to render html
credits: https://gist.github.com/aahnik/3ddbc3daf72890c4566498138cd14797
*/

import express from "express";
import fs from "fs";
import ejs from "ejs";

const server = express();

server.set("view engine", "ejs");

// credits: suvan
// https://stackoverflow.com/questions/60203249/ejs-async-true-with-node-express
server.engine("ejs", async (path, data, cb) => {
  try {
    let html = await ejs.renderFile(path, data, { async: true });
    cb(null, html);
  } catch (e) {
    cb(e, "");
  }
});

function filesToRender(dir) {
  function fileSubstring(file, dir) {
    return file.substring(0, file.length - 4).replace(dir, "");
  }

  function readDirRecursive(dir, filelist) {
    let files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.map((file) => {
      if (fs.statSync(dir + "/" + file).isDirectory()) {
        filelist = readDirRecursive(dir + "/" + file, filelist);
      } else {
        filelist.push(dir + "/" + file);
      }
    });
    return filelist;
  }

  return readDirRecursive(dir).map((file) => {
    return fileSubstring(file, dir);
  });
}

function renderFile(file) {
  server.get(file, (req, res) => {
    return res.render(file.slice(1));
  });
  if (file.slice(-5) === "index") {
    server.get(file.substring(0, file.length - 5), (req, res) => {
      return res.render(file.slice(1));
    });
  }
}

filesToRender("views").map((file) => renderFile(file));

server.use(express.static("public"));

server.listen(3003, () => {
  console.log(`Serving ejs from ${3003}`);
});
