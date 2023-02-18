let http = require('http')
let fs = require('fs')

let pathToStatic = "/home/alexander_i_bakalov/ConnectMyMind/ConnectMyMind/client/connect-my-mind/build/static/"
let ip = "10.0.0.211"

//micro services
//hate speech
let hateSpeechServiceID = "hateSpeech"
let hateSpeechServicePort = 80
let hateSpeechServiceEndPoint = "hateSpeech"

//image proccessor
let imageProcessorServiceID = "imageProcessor"
let imageProcessorServicePort = 80
let imageProcessorServiceEndPoint = "imageProcessor"

function serveFile(method, path, name, contentType, surl, res, req) {
    if (method == 'GET' && surl.pathname == path) {
        fs.readFile(name, function (err, html) {
            if (err) {
                console.log(err)
                return true
            }
            res.writeHead(200, { 'Content-Type': contentType })
            res.write(html)
            res.end()
        })
        return true
    }
    return false
}

let server = http.createServer(function (req, res) {
    const { method, url } = req
    let surl = new URL(url, `http://${ip}/`)

    if (method == 'GET' && surl.pathname.startsWith('/static')) {
        let fileName = surl.pathname.substring(11)
        let extention = fileName.substring(fileName.lastIndexOf('.') + 1)
        let oldExtention
        if (extention == "map" && surl.pathname.slice(-6) == "ss.map") {
            oldExtention = extention
            extention = "css"
        } else if (extention == "map" && surl.pathname.slice(-6) == "js.map") {
            oldExtention = extention
            extention = "js"
        }
        if (extention == "otf") {
            oldExtention = extention
            extention = "media"
            fileName = fileName.substring(3)
        }
        fs.readFile(`${pathToStatic}${extention}/${fileName}`, function (err, html) {
            if (err) {
                throw err
            }
            if (oldExtention == undefined) {
                res.writeHead(200, { 'Content-Type': 'text/' + extention })
            } else if (oldExtention == "otf") {
                res.writeHead(200, { 'Content-Type': 'application/x-font-opentype' })
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
            }
            res.write(html)
            res.end()
        })
        return
    }

    //frontend -> server
    if (method == 'GET' && surl.pathname == '/url') {
        let searchParams = surl.searchParams
        let url = searchParams.get('url')

        res.writeHead(200, { 'Content-Type': 'application/json' })

        //server -> hate speech (url)
        return fetch(
            `http://${hateSpeechServiceID}:${hateSpeechServicePort}/${hateSpeechServiceEndPoint}?url=${url}`,
            { method: 'GET'}
        )
            .catch(error => console.log("error (server -> hatespeech service):", error))
            .then(response => response.text())
            .then(r => {
                //server -> frontend
                res.write(r)
                res.end()
            })
    }

    //hate speech -> server (img url)
    if (method == 'GET' && surl.pathname == '/image') {
        let searchParams = surl.searchParams
        let url = searchParams.get('url')

        res.writeHead(200, { 'Content-Type': 'application/json' })

        //server -> image processor (img url)
        return fetch(
            `http://${imageProcessorServiceID}:${imageProcessorServicePort}/${imageProcessorServiceEndPoint}?url=${url}`,
            { method: 'GET'}
        )
            .catch(error => console.log("error (server -> image processor):", error))
            .then(response => response.text())
            .then(r => {
                //server -> hate speech
                res.write(r)
                res.end()
            })
    }

    //if (serveFile("GET", "/style.css", "./style.css", "text/css", surl, res, req)) return
})

server.listen(80)