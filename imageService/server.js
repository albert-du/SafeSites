import http from 'http'
import fetch from 'node-fetch'
import Tesseract from 'tesseract.js'

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

http.createServer((request, response) => {
	const { method, url } = request
	const url_parts = require('url').parse(request.url);
	if (method == 'GET' && url_parts.query) {
		let imageUrl = url_parts.query.substring(4);
		if (imageUrl) {
			console.log('works');
			extractTextFromImage(imageUrl)
				.then(text => {
					response.writeHead(200, { 'Content-Type': 'text/plain' });
					response.write(text);
					response.end();
				})
				.catch(error => {
					console.error(error);
					response.writeHead(500, { 'Content-Type': 'text/plain' });
					response.write('Error occurred while extracting text');
					response.end();
				});
		}
	}
}).listen(81);