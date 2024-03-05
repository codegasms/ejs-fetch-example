/*
frontend server
server HTML,CSS and frontend js

use ejs to render html
*/

import express from "express";
import fs from "fs";

const server = express();

server.set("view engine", "ejs");

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
  console.log(file);

  server.get(file, (req, res) => {
    res.render(file.slice(1));
  });

  if (file.slice(-5) === "index") {
    server.get(file.substring(0, file.length - 5), (req, res) => {
      res.render(file.slice(1), { async: true, client: true });
    });
  }
}

filesToRender("views").map((file) => renderFile(file));

server.use(express.static("public"));

server.listen(3001, () => {
  console.log(`Serving ejs from ${3001}`);
});
