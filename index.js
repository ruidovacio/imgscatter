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
    const sendBuffer = await parseFile(req);
    const process = await glitch(sendBuffer, req.query);
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

//helpers
async function parseFile(req) {
  if (req.file == undefined) {
    console.log("string recibido");
    const fetchImage = await fetch(req.body.image);
    const blob = await fetchImage.blob();
    const buffer = await blob.arrayBuffer();
    return buffer;
  } else {
    console.log("imagen recibido");
    const buffer = req.file.buffer;
    return buffer;
  }
}

//export
module.exports = app;
