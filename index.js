/*
frontend server
server HTML,CSS and frontend js

use ejs to render html
*/

import express from "express";
import fs from "fs";
import ejs from "ejs";
//
// const server = express();
//
// server.set("view engine", "ejs");
//
// function filesToRender(dir) {
//   function fileSubstring(file, dir) {
//     return file.substring(0, file.length - 4).replace(dir, "");
//   }
//
//   function readDirRecursive(dir, filelist) {
//     let files = fs.readdirSync(dir);
//     filelist = filelist || [];
//     files.map((file) => {
//       if (fs.statSync(dir + "/" + file).isDirectory()) {
//         filelist = readDirRecursive(dir + "/" + file, filelist);
//       } else {
//         filelist.push(dir + "/" + file);
//       }
//     });
//     return filelist;
//   }
//
//   return readDirRecursive(dir).map((file) => {
//     return fileSubstring(file, dir);
//   });
// }
//
// async function renderFile(file) {
//   server.get(file, (req, res) => {
//     res.render(file.slice(1), { async: true, client: true });
//   });
//   if (file.slice(-5) === "index") {
//     server.get(file.substring(0, file.length - 5), (req, res) => {
//       res.render(file.slice(1), { async: true, client: true });
//     });
//   }
// }
//
// filesToRender("views").map(async (file) => await renderFile(file));
//
// server.use(express.static("public"));
//
// server.listen(3001, () => {
//   console.log(`Serving ejs from ${3001}`);
// });

const app = express();
app.set("view engine", "ejs");
app.engine("ejs", async (path, data, cb) => {
  try {
    let html = await ejs.renderFile(path, data, { async: true, client: true });
    cb(null, html);
  } catch (e) {
    cb(e, "");
  }
});

const standardResponse = (err, html, res) => {
  // If error, return 500 page
  if (err) {
    console.log(err);
    // Passing null to the error response to avoid infinite loops XP
    return res
      .status(500)
      .render(`layout.ejs`, { page: "500", error: err }, (err, html) =>
        standardResponse(null, html, res),
      );
    // Otherwise return the html
  } else {
    return res.status(200).send(html);
  }
};

app.route("/test").get(async (req, res) => {
  // layout.ejs is my version of blocking. I pass the page name as an option to render custom pages in the template
  return await res.render(`test.ejs`, { page: "test" }, (err, html) =>
    standardResponse(err, html, res),
  );
});

app.use(express.static("public"));

app.listen(3001, () => {
  console.log(`Serving ejs from ${3001}`);
});
