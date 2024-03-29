let http = require('http')
let fs = require('fs')
let puppeteer = require('puppeteer')
let cheerio = require("cheerio")
require('dotenv').config();

let imgAnalysis = process.env.IMAGE_ANALYSIS

let pathToStatic = process.env.PATH_TO_STATIC

let pathToBuild = pathToStatic.substring(0, pathToStatic.length - 8)

let ip = process.env.IP

//micro services
//hate speech
let hateSpeechServiceID = process.env.HATE_SERVICE_ID
let hateSpeechServiceEndPoint = ""
let hateSpeechServicePort = process.env.HATE_SERVICE_PORT

//image proccessor
let imageProcessorServiceID = process.env.IMAGE_PROCESSOR_ID
let imageProcessorServicePort = process.env.IMAGE_PROCESSOR_PORT
let imageProcessorServiceEndPoint = ""

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
        console.log(url)

        res.writeHead(200, { 'Content-Type': 'application/json' })

        let text
        return fetch(
            url,
            { method: 'GET' }
        )
            .catch(error => {
                console.log("error (server -> url):", error)
                res.write("")
                res.end()
                return
            })
            .then(response => {
                if (response) {
                    return response.text()
                }
            })
            .then(r => {
                let $
                try {
                    $ = cheerio.load(r);
                } catch {
                    return
                }
                (async () => {
                    const browser = await puppeteer.launch({
                        headless: true,
                        args: ['--no-sandbox', '--disable-gpu'],
                    })
                    const page = (await browser.pages())[0]
                    await page.goto(url)
                    await new Promise(r => setTimeout(r, 1000));
                    text = await page.$eval('*', (el) => el.innerText)
                    text = text.replace(/\n/g, " ")

                    await browser.close()

                    if (imgAnalysis) {
                        let imagesArr = []
                        $("img").each((i, e) => {
                            let imgSrc = $(e).attr('src')

                            if (imgSrc) {
                                if (!imgSrc.startsWith("http")) {
                                    if (url.endsWith("/")) {
                                        imgSrc = url.substring(0, url.length - 1) + imgSrc
                                    } else {
                                        imgSrc = url + imgSrc
                                    }
                                }
                                imagesArr.push(imgSrc)
                            }
                        })

                        let fetches = []
                        for (let i = 0; i < imagesArr.length; i++) {
                            fetches.push(
                                fetch(
                                    `http://${imageProcessorServiceID}:${imageProcessorServicePort}/${imageProcessorServiceEndPoint}?img=${imagesArr[i]}`,
                                    { method: 'GET' }
                                )
                                    .catch(error => console.log("error (server -> image processor):", error))
                                    .then(response => {
                                        if (response) {
                                            return response.text()
                                        } else {
                                            return ""
                                        }
                                    })
                                    .then(r => text += r)
                            )
                        }
                        text = text.replace(/[^a-zA-Z0-9 ]/g, '');
                        Promise.all(fetches).then(() => {
                            return fetch(
                                `http://${hateSpeechServiceID}:${hateSpeechServicePort}/${hateSpeechServiceEndPoint}`,
                                { method: 'POST', body: text }
                            )
                                .catch(error => console.log("error (server -> hate service):", error))
                                .then(response => response.text())
                                .then(r => {
                                    res.write(r)
                                    res.end()
                                })
                        })
                    } else {
                        text = text.replace(/[^a-zA-Z0-9 ]/g, '');
                        return fetch(
                            `http://${hateSpeechServiceID}:${hateSpeechServicePort}/${hateSpeechServiceEndPoint}`,
                            { method: 'POST', body: text }
                        )
                            .catch(error => console.log("error (server -> hate service):", error))
                            .then(response => response.text())
                            .then(r => {
                                res.write(r)
                                res.end()
                            })
                    }
                })()
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
            { method: 'GET' }
        )
            .catch(error => console.log("error (server -> image processor):", error))
            .then(response => response.text())
            .then(r => {
                //server -> hate speech
                res.write(r)
                res.end()
            })
    }

    if (serveFile("GET", "/favico.ico", pathToBuild + "\\favicon.ico", "image/x-icon", surl, res, req)) return
    if (serveFile("GET", "/", pathToBuild + "\\index.html", "text/html", surl, res, req)) return
    if (serveFile("GET", "/scan", pathToBuild + "\\index.html", "text/html", surl, res, req)) return
    if (serveFile("GET", "/asset-manifest.json", pathToBuild + "\\asset-manifest.json", "application/json", surl, res, req)) return
    if (serveFile("GET", "/manifest.json", pathToBuild + "\\manifest.json", "application/json", surl, res, req)) return
})

server.listen(80)