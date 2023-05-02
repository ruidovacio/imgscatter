const sharp = require("sharp");
const shuffleArray = require("shuffle-array");
const shuffle = require("shuffle-array");

async function ruido(input) {
  const img = await sharp(input).resize({width: 300, height: 300}).toBuffer();
  const meta = await sharp(input).metadata();
  console.log(meta);
  //   const module = await sharp(img)
  //     .resize({width: 100})
  //     .webp({effort: 0, quality: 1})
  //     .toBuffer();
  let module = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      //   const rndh = Math.round(Math.random(meta.height - 100) * 100);
      //   const rndw = Math.round(Math.random(meta.width - 100) * 100);
      const trim = await sharp(img)
        .extract({top: j * 30, left: i * 30, height: 30, width: 30})
        .resize({width: 30})
        .webp()
        .toBuffer();
      row.push(trim);
    }
    module.push(row);
  }

  let base = await sharp({
    create: {
      width: 300,
      height: 300,
      channels: 3,
      background: {r: 255, g: 255, b: 255},
    },
  })
    .jpeg()
    .toBuffer();

  for (let i = 0; i < module.length; i++) {
    module[i] = shuffle(module[i]);
  }
  module = shuffle(module);

  //scatter
  for (i = 0; i < module.length; i++) {
    for (let j = 0; j < module[i].length; j++) {
      base = await sharp(base)
        .composite([{input: module[i][j], top: i * 30, left: j * 30}])
        .toBuffer();
    }
  }

  const post = await sharp(base).sharpen({sigma:1, m1:1, m2:50}).threshold(128).webp().toBuffer();

  return post;
}

module.exports = ruido;
