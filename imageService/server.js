import http from 'http'
import fetch from 'node-fetch'
import mime from 'mime';
import Tesseract from 'tesseract.js'
import urlParser from 'url'

async function extractTextFromImage(url) {
	try {
		const response = await fetch(url).catch(error => console.log("catch", error))
		
		let header = ""
		response.headers.forEach((value, name) => {
			if (name === "content-type")
				header = value;
		});
		console.log(url, "--------------------------")
		let m = mime.getExtension(header);
		console.log(m)
		if (["jpg", "jpeg", "png", "bmp", "pbm"].includes(m.toLowerCase())) {
			const buffer = await response.arrayBuffer();
			let image = await Tesseract.recognize(buffer, 'eng', { errorHandler: m => console.log(m) })
			return image.data.text;
		} else {
			return "_"
		}
	} catch (error) {
		console.log(error);
		return "Error occurred while extracting text";
	}
}

http.createServer((request, response) => {
	const { method, url } = request
	const url_parts = urlParser.parse(request.url);
	if (method == 'GET' && url_parts.query) {
		let imageUrl = url_parts.query.substring(4);
		console.log(1)
		if (imageUrl) {
			console.log(2)
			extractTextFromImage(imageUrl)
				.then(text => {
					console.log(text)
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