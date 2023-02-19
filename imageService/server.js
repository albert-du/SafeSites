/**
 * 
 */
const http = require('http');
const fs = require('fs');
const url = require('url');
const { extractTextFromImage } = require('./imageProcesser');

http.createServer((request, response) => {
	const{method, url} = request
	const url_parts = require('url').parse(request.url);
	if (method == 'GET' && url_parts.query){
		let imageUrl = url_parts.query.substring(4);
		if (imageUrl){
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
}).listen(80);