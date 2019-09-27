import express from "express";
import path from "path";

const app = express();
const port = 80;

app.get("*", (req, res) => {
  var root = {root: path.join(__dirname, "../docs")};
  if (!new RegExp(".js$").test(req.url) && new RegExp("^/[a-zA-Z0-9_@.]*$").test(req.url)) {
    res.sendFile("index.html", root);
  } else {
    res.sendFile(req.url, root);
  }
});

app.listen(port);
console.log("Listening on port " + port + ".");
