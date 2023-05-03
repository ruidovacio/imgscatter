const sharp = require("sharp");
const shuffle = require("shuffle-array");

async function ruido(input) {
  //cargar imagen y llevar a 300px
  const img = await sharp(input).resize({width: 300, height: 300}).toBuffer();
  const meta = await sharp(input).metadata();
  console.log(meta);

  //base de la grilla y unidad
  let module = [];
  let gridSize = 4;
  let unit = Math.trunc(300 / gridSize);

  //recorte inicial
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      let trim = await sharp(img)
        .extract({top: j * unit, left: i * unit, height: unit, width: unit})
        .resize({width: unit})
        .webp()
        .toBuffer();
      const chance = Math.random();
      if (chance > 0.8) {
        trim = await sharp(trim).negate().toBuffer();
      }
      row.push(trim);
    }
    module.push(row);
  }
  //randomizar recortes
  for (let i = 0; i < module.length; i++) {
    module[i] = shuffle(module[i]);
  }
  module = shuffle(module);

  //crear base en blanco donde van los recortes
  let base = await sharp({
    create: {
      width: 300,
      height: 300,
      channels: 3,
      background: {r: 255, g: 255, b: 255},
    },
  })
    .webp()
    .toBuffer();

  //incrustar cada recorte en la grilla
  for (let i = 0; i < module.length; i++) {
    for (let j = 0; j < module[i].length; j++) {
      const chance = Math.random();
      if (chance < 0.8) {
        base = await sharp(base)
          .composite([{input: module[i][j], top: i * unit, left: j * unit}])
          .toBuffer();
      } else {
        const r = Math.round(Math.random() * (module.length - 1));
        console.log(r);
        base = await sharp(base)
          .composite([{input: module[r][r], top: i * unit, left: j * unit}])
          .toBuffer();
      }
    }
  }

  //filtros finales
  const post = await sharp(base)
    .sharpen({sigma: 1, m1: 1, m2: 50})
    .threshold(128)
    .webp()
    .toBuffer();

  return post;
}

module.exports = ruido;
