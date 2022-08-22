const puppeteer = require('puppeteer')
const https = require('https')
const fs = require('fs')
const fsPromises = fs.promises

const formulae = [require('./formulae/brampton-transit'), require('./formulae/uoft-campus')]

const FORCE_OUTPUT = true

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

async function manageDownload ({ downloadUrl, downloadExtension, downloadOutputs, formula }) {
  const downloadName = `${formula.shortName}.${downloadExtension}`
  const downloadPath = `downloads/${downloadName}`
  await downloadPromise(downloadUrl, downloadPath)

  const cachePath = `cache/${downloadName}`
  try {
    await fsPromises.stat(cachePath)
    // download precisely matches cache---so there's nothing new to bother with
    if (fs.readFileSync(downloadPath).equals(fs.readFileSync(cachePath)) && !FORCE_OUTPUT) return
  } catch (err) {
    // file with download name does not exist in cache
    await fsPromises.rename(downloadPath, cachePath)
  }

  for (const o of downloadOutputs) {
    const idStamp =  (o.omitId) ? '' : `-${o.id}`
    const output = `output/${formula.shortName}${getMonthStamp()}${idStamp}.png`
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
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (const formula of formulae) {
    await runFormula({ formula, page })
  }

  await browser.close()
}

main()
