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

async function main () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const f = formulae[0]
  const a = f.actions[0]

  await page.goto(f.url)
  // First download to cache
  const downloadUrl = await page.evaluate(a.getDownloadUrl)
  const downloadDest = `cache/${f.shortName}.${a.downloadExtension}`
  download(downloadUrl, downloadDest, (err) => {
    if (err) return
    // Then generate output
    const d = new Date()
    let outputDest = `output/${f.shortName}${d.getUTCFullYear()}${d.getUTCMonth()}`
    if (a.outputSuffix) outputDest += `-${a.outputSuffix}`
    const outputExtension = 'png'
    a.generateOutput(downloadDest, outputDest, outputExtension)
  })

  await browser.close()
}
main()
