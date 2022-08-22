const https = require('https')
const fs = require('fs')
const fsPromises = fs.promises

const FORCE_OUTPUT = true
// Might want to sanitize FORMULAE_DIR if taking it as an argument
const FORMULAE_DIR = './formulae'
const DOWNLOADS_DIR = './downloads'
const CACHE_DIR = './cache'
const OUTPUT_DIR = './output'

// Can't believe it's this easy to import all the formulae
const formulae = []
fs.readdirSync(FORMULAE_DIR).forEach((formulaName) => {
  if (formulaName.endsWith('.js')) {
    formulae.push(require(`${FORMULAE_DIR}/${formulaName}`))
  }
})

// See https://stackoverflow.com/a/22907134
function download (url, dest, cb) {
  const file = fs.createWriteStream(dest, cb)
  https.get(url, (response) => {
    response.pipe(file)
    file.on('finish', () => {
      file.close(cb)
    }) // close() is async, call cb after close completes.
  }).on('error', (err) => {
    fs.unlink(dest, cb) // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message)
  })
}

function downloadPromise (url, dest) {
  return new Promise((resolve, reject) => {
    download(url, dest, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

function getMonthStamp () {
  const d = new Date()
  const [year, month] = d.toISOString().split('-')
  return year + month
}

async function manageDownload ({ downloadUrl, downloadExtension, downloadOmitId, downloadId, downloadOutputs, formula }) {
  const downloadIdStamp =  (downloadOmitId) ? '' : `-${downloadId}`
  const downloadName = `${formula.shortName}${downloadIdStamp}.${downloadExtension}`
  const downloadPath = `${DOWNLOADS_DIR}/${downloadName}`
  await downloadPromise(downloadUrl, downloadPath)

  const cachePath = `${CACHE_DIR}/${downloadName}`
  try {
    await fsPromises.stat(cachePath)
    // download precisely matches cache---so there's nothing new to bother with
    if (fs.readFileSync(downloadPath).equals(fs.readFileSync(cachePath)) && !FORCE_OUTPUT) return
  } catch (err) {
    // file with download name does not exist in cache
    await fsPromises.rename(downloadPath, cachePath)
  }

  for (const o of downloadOutputs) {
    const outputIdStamp =  (o.omitId) ? '' : `-${o.id}`
    const output = `${OUTPUT_DIR}/${formula.shortName}${getMonthStamp()}${downloadIdStamp}${outputIdStamp}.png`
    o.generate(cachePath, output)
  }
}

async function manageWebscrapeDownload ({ dl, formula, page }) {
  // First download to cache
  const downloadUrl = await page.evaluate(dl.getUrl)
  manageDownload({
    downloadUrl,
    downloadExtension: dl.extension,
    downloadOutputs: dl.outputs,
    downloadOmitId: dl.omitId,
    downloadId: dl.id,
    formula
  })
}

const formulaRunners = {
  async webscrape ({ formula, page }) {
    await page.goto(formula.scrapeUrl)

    for (const dl of formula.downloads) {
      try {
        await manageWebscrapeDownload({ dl, formula, page })
      } catch (err) {
        console.log('Download failed!', {
          formulaName: formula.name,
          formulaType: formula.type,
          downloadUrl: dl.url
        })
      }
    }
  },
  async static ({ formula }) {
    const dl = formula.download
    try {
      await manageDownload({
        downloadUrl: dl.url,
        downloadExtension: dl.extension,
        downloadOutputs: dl.outputs,
        downloadId: dl.id,
        downloadOmitId: dl.omitId,
        formula
      })
    } catch (err) {
      console.log('Download failed!', {
        formulaName: formula.name,
        formulaType: formula.type,
        downloadUrl: dl.url
      })
    }
  }
}

async function runFormula (options) {
  await formulaRunners[options.formula.type](options)
}

async function main () {
  // Check if there are any webscrape formulae before launching puppeteer
  // In fact, we check before even importing it!
  if (formulae.some(formula => formula.type === 'webscrape')) {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    for (const formula of formulae) {
      await runFormula({ formula, page })
    }

    await browser.close()
    return
  }

  // Otherwise, completely skip puppeteer :D
  for (const formula of formulae) {
    // Static formulae are blazingly fast!
    await runFormula({ formula })
  }
}

main()
