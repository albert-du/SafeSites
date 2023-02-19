let http = require('http')
let fs = require('fs')
let puppeteer = require('puppeteer')
let cheerio = require("cheerio")

let pathToStatic = "/place/holder/to/build/static/"
let ip = "10.0.0.211"

//micro services
//hate speech
let hateSpeechServiceID = "hateService"
let hateSpeechServiceEndPoint = "speech"
let hateSpeechServicePort = 80

//image proccessor
let imageProcessorServiceID = "imageProcessor"
let imageProcessorServicePort = 80
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

        res.writeHead(200, { 'Content-Type': 'application/json' })

        let text
        return fetch(
            url,
            { method: 'GET' }
        )
            .catch(error => console.log("error (server -> url):", error))
            .then(response => response.text())
            .then(r => {
                let $ = cheerio.load(r);
                (async () => {
                    const browser = await puppeteer.launch({
                        headless: true
                    })
                    const page = (await browser.pages())[0]
                    await page.goto(url)
                    text = await page.$eval('*', (el) => el.innerText)
                    text = text.replace(/\n/g, " ")

                    await browser.close()

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
                                .then(response => response.text())
                                .then(r => text += r)
                        )
                    }

                    Promise.all(fetches).then(() => {
                        return fetch(
                            `http://${hateSpeechServiceID}:${hateSpeechServicePort}/${hateSpeechServiceEndPoint}?text=${text}`,
                            { method: 'GET' }
                        )
                            .catch(error => console.log("error (server -> image processor):", error))
                            .then(response => response.text())
                            .then(r => {
                                res.write(r)
                                res.end()
                            })
                    })
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

    //if (serveFile("GET", "/style.css", "./style.css", "text/css", surl, res, req)) return
})

server.listen(80)