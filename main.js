const puppeteer = require('puppeteer')
const https = require('https')
const fs = require('fs')
const { exec } = require('child_process')

const formulae = [require('./formulae/brampton-transit')]

// See https://stackoverflow.com/a/22907134
function download (url, dest, cb) {
  const file = fs.createWriteStream(dest, cb)
  const request = https.get(url, (response) => {
    response.pipe(file)
    file.on('finish', () => {
      file.close(cb)
      console.log('Download completed')
    }) // close() is async, call cb after close completes.
  }).on('error', (err) => {
    fs.unlink(dest, cb) // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message)
  })
}

function getMonthStamp () {
  const d = new Date()
  const [year, month] = d.toISOString().split('-')
  return year + month
}

async function manageDownload ({ dl, formula, page }) {
  // First download to cache
  const downloadUrl = await page.evaluate(dl.getUrl)
  const downloadName = `${formula.shortName}.${dl.extension}`
  const downloadPath = `downloads/${downloadName}`
  download(downloadUrl, downloadPath, (err) => {
    if (err) return

    const cachePath = `cache/${downloadName}`
    fs.stat(cachePath, (err, stat) => {
      // If the download is the same as the cache, no update
      // Hence no point in generating output (a rather costly operation)
      if (err === null) {
        //if (fs.readFileSync(downloadPath).equals(fs.readFileSync(cachePath))) return
      }

      // Move to cache
      fs.rename(downloadPath, cachePath, (err) => {
        if (err) return
        // Then generate output
        for (const o of dl.outputs) {
          const d = new Date()
          let output = `output/${formula.shortName}${getMonthStamp()}`
          if (!o.omitId) output += `-${o.id}`
          output += '.png'
          o.generate(cachePath, output)
        }
      })
    })
  })
}

const formulaRunners = {
  async webscrape ({ formula, page }) {
    await page.goto(formula.scrapeUrl)

    for (const dl of formula.downloads) {
      await manageDownload({ dl, formula, page })
    }
  }
}

async function runFormula (options) {
  await formulaRunners[options.formula.type](options)
}

async function main () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const f = formulae[0]

  await runFormula({ formula: f, page })

  await browser.close()
}

main()
