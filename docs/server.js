const express = require("express")
const app = express()
const port = 8000;
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");

const fm_path = file_name => {  
  return path.join(__dirname, "..", "fm", file_name + ".fm");
};

const fm_save = (async function save(file_name, file_text, version = 0) {
  var file_path = fm_path(file_name + "@" + version);
  if (fs.existsSync(file_path)) {
    //var new_file_text = await fsp.readFile(file_path, "utf8");
    //if (new_file_text === file_text) {
      //return file_name + "@" + version;
    //} else {
    return save(file_name, file_text, version + 1);
    //}
  } else {
    try {
      fsp.writeFile(file_path, file_text);
      return file_name + "@" + version;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
});

const fm_load = (async function load(versioned_file_name) {
  try {
    var file_path = fm_path(versioned_file_name);
    if (fs.existsSync(file_path)) {
      return await fsp.readFile(file_path, "utf8");
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("*", (req, res) => {
  res.sendFile("/docs" + (req.path === "/" ? "/index.html" : req.path), {root: __dirname + "/.."});
});

//app.post("/save", (req, res) => {
  //var file = req.body.file;
  //var code = req.body.code;


//});

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
