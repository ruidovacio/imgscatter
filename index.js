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

const glitch = require("./scatter.js");
app.use(cors());

//static
app.use(express.static(__dirname + "/public"));

//routes
app.post("/scatter", upload.single("image"), async (req, res, next) => {
  try {
    console.log("imagen recibida");
    const process = await glitch(req.file.buffer, req.query);
    //const result = Buffer.from(process).toString("base64");
    // const html = `<img src="data:image/jpeg;base64,${result}">`;
    // res.set("Content-Type", "text/html");
    res.send(process);
    //}
  } catch (err) {
    next(err);
  }
});

//server
app.listen(3000, () => {
  console.log("Escuchando en 3000...");
});

//export
module.exports = app;
