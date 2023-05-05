const sharp = require("sharp");
const shuffle = require("shuffle-array");

async function ruido(input, queries) {
  //cargar imagen y llevar a 300px
  const img = await sharp(input).resize({width: 300, height: 300}).toBuffer();
  const meta = await sharp(input).metadata();
  console.log(meta);
  console.log(queries);

  //base de la grilla y unidad
  let module = [];
  let gridSize = queries.grid;
  let artStyle = queries.style;
  let shouldRepeat = queries.repeat;
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
      //alterar cada recorte individual
      if (chance > 0.8) {
        trim = await sharp(trim).modulate({saturation: 0}).toBuffer();
      }
      row.push(trim);
    }
    module.push(row);
  }

  //randomizar recortes
  let shuffleModules = [];
  module.map((x, i) => {
    module[i].map((y, j) => {
      shuffleModules.push(module[i][j]);
    });
  });
  shuffleModules = shuffle(shuffleModules);
  let count = 0;
  module.map((x, i) => {
    module[i].map((y, j) => {
      module[i][j] = shuffleModules[count];
      count += 1;
    });
  });

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
      const r = Math.round(Math.random() * (module.length - 1));
      base = await sharp(base)
        .composite([
          {
            input: shouldRepeat === "true" ? module[r][r] : module[i][j],
            top: i * unit,
            left: j * unit,
          },
        ])
        .toBuffer();
    }
  }
  console.log(artStyle);
  //filtros finales
  //1. basic 2. begotten
  if (artStyle === "basic") {
    const post = await sharp(base).webp().toBuffer();
    return post;
  } else if (artStyle === "begotten") {
    const post = await sharp(base).threshold(128).negate().webp().toBuffer();
    return post;
  } else if (artStyle === "ripples") {
    const post = await sharp(base)
      .blur(30)
      .sharpen({sigma: 3, m1: 200, m2: 50})
      .threshold(128)
      .composite([{input: base, top: 0, left: 0, blend: "difference"}])
      .modulate({lightness:10})
      .negate()
      .webp()
      .toBuffer();
    return post;
  }
}

module.exports = ruido;

//styles
//ultrawaves (negate en random trim al iniciar)
// const post = await sharp(base)
// .blur(30)
// .sharpen({sigma: 3, m1: 200, m2: 50})
// .threshold(128)
// .webp()
// .toBuffer();

// grietas
// const post = await sharp(base)
// .blur(30)
// .median(20)
// .sharpen({sigma: 1, m1: 200, m2: 500})
// // .threshold(128)
// .webp()
// .toBuffer();

//ripples
// const post = await sharp(base)
// .blur(30)
// .median(2)
// .sharpen({sigma: 10, m1: 200, m2: 500})
// // .threshold(128)
// .webp()
// .toBuffer();
