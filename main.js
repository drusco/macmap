/*
**  Nuxt.js part
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
let win = null // Current window

const http = require('http')
const {Nuxt, Builder} = require('nuxt')

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
config.rootDir = __dirname // for electron-packager

// Init Nuxt.js
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)

// Build only in dev mode
if (config.dev) {
    builder.build()
        .catch((error) => {
            console.error(error) // eslint-disable-line no-console
            process.exit(1)
        })
}

// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`Nuxt working on ${_NUXT_URL_}`)

/*
** Electron app
*/
const electron = require('electron')
const slugify = require('slugify')
const json2xls = require('json2xls')
const zip = require('node-zip')
const {download} = require('electron-dl')
const {ipcMain} = electron
const path = require('path')
const url = require('url')

const POLL_INTERVAL = 300
let SERVER_DOWN = true

const pollServer = () => {
    http.get(_NUXT_URL_, (res) => {
        SERVER_DOWN = res.statusCode !== 200
        if(SERVER_DOWN) setTimeout(pollServer, POLL_INTERVAL)
    }).on('error', pollServer)
}

const app = electron.app
const bw = electron.BrowserWindow

const ready = () => {
    pollServer()
    const loop = setInterval(() => {
        if(!SERVER_DOWN) {
            newWin()
            clearInterval(loop)
        }
    }, POLL_INTERVAL)
}

const newWin = () => {

    win = new bw({
        width: config.electron.width,
        height: config.electron.height,
        minWidth: config.electron.width,
        minHeight: config.electron.height,
        frame: false,
        icon: path.resolve('./static/icon.png'),
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadURL(_NUXT_URL_)
    win.on('closed', () => win = null)

    if(config.dev){
        win.webContents.openDevTools({mode: 'undocked'})
    }

    let percent = 0

    ipcMain.on('window-close', (event, arg) => win.close())
    ipcMain.on('window-maximize', (event, arg) => win[win.isMaximized() ? 'unmaximize' : 'maximize']())
    ipcMain.on('window-minimize', (event, arg) => win.minimize())

    ipcMain.on('get-download-progress', (event, arg) => {
        event.returnValue = percent
    })

    ipcMain.on('download', (event, results) => {

        percent = 0
        const dl = new zip();

        results.forEach(country => {
            country.data.forEach(product => {

                product.data.forEach(c => delete c['ReporterName'])

                let xls = json2xls(product.data)
                let buf = Buffer.from(xls, 'binary')

                dl.file(slugify(country.name + '-' + product.code + '.xlsx').toLocaleLowerCase(), buf)

            })
        })

        const data = dl.generate({base64: true, compression: 'DEFLATE'});

        download(bw.getFocusedWindow(), 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + data, {
            saveAs: true,
            filename: 'macmap-' + Date.now() + '.zip',
            onProgress(d) {
                percent = d.percent
            }
        }).then(dl => {}).catch(err => {});

    })

}

app.on('ready', ready)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())