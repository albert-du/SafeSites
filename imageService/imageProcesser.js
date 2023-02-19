/**
 * 
 */
const fetch = require('node-fetch');
const Tesseract = require('tesseract.js');

async function extractTextFromImage(url) {
  try {
	  console.log(url);
    const response = await fetch(url).catch(error => console.log("catch", error));
    console.log('hi');
    const buffer = await response.buffer();
    const image = await Tesseract.recognize(buffer, 'eng');
    return image.data.text;
  } catch (error) {
    console.log(error);
    return "Error occurred while extracting text";
  }
}

module.exports = {
  extractTextFromImage
};

