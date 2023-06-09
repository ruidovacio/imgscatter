//init
const express = require("express");
const app = express();

//middleware
const sharp = require("sharp");
const cors = require("cors");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

function fileFilter(req, file, cb) {
  console.log(`size: ${req.headers["content-length"]}`);
  if (req.headers["content-length"] > upload.limits.fileSize) {
    console.log("bad file size");
    cb(new Error("bad file size"), false);
  } else {
    console.log("ok file size");
    cb(null, true);
  }
}

const glitch = require("./src/scatter.js");
app.use(cors());

//static
app.use(express.static(__dirname + "/public"));

//routes
app.post("/scatter", upload.single("image"), async (req, res, next) => {
  try {
    //parsear si el query viene en el body o en la url
    const sendQuery =
      req.body.query == undefined ? req.query : JSON.parse(req.body.query);
    const sendBuffer = req.file.buffer;
    const process = await glitch(sendBuffer, sendQuery);
    const dataUrl = `data:image/webp;base64,${process.toString("base64")}`;
    res.send(dataUrl);
  } catch (err) {
    next(err);
  }
});

app.get("/documentation", (req, res) => {
  res.sendFile(__dirname + "/public/documentation.html");
});

//server
app.listen(3000, () => {
  console.log("Escuchando en 3000...");
});


//export
module.exports = app;
