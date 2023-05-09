## imgscatter

![imgscatter](https://raw.githubusercontent.com/ruidovacio/imgscatter/main/public/imgs/glitch3.webp)

**about**

i make visuals based on textures so i thought it'd be cool to implement a code solution that could emulate some of my work which you can check on my giphy page 👽

the api uses express/multer for serverside file handling, and the sharp library for image processing and glitching.

**try it online**

there is a web interface available at [imgscatter.vercel.app](https://imgscatter.vercel.app)

**api documentation**

imgscatter is mainly handled with POST requests, you can find the guide [here](https://imgscatter.vercel.app/documentation) on how to send images and pick parameters

**installing**

you can also clone this project and then run `npm install`. you can locally run the web interface with `node index.js`, and then open `localhost:3000` on your browser.
