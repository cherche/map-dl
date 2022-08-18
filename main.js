const puppeteer = require('puppeteer')
const https = require('https')
const fs = require('fs')
const { exec } = require('child_process')

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

const url = 'https://www.brampton.ca/EN/residents/transit/plan-your-trip/Pages/Schedules-Maps-Covid.aspx'

async function getFileUrl () {
  const buttons = document.querySelectorAll('.jumbotron.transit .btn')
  return buttons[1].href
}

function processFile (input) {
  exec(`pdftoppm ${input} brampton-transit -png -f 1 -singlefile -r 300`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    //console.log(`stdout: ${stdout}`)
  })
}

async function main () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(url)
  console.log(await page.title())
  const fileUrl = await page.evaluate(getFileUrl)
  console.log(fileUrl)

  download(fileUrl, 'brampton-transit.pdf', (err) => {
    if (err) return
    processFile('brampton-transit.pdf')
  })


  await browser.close()
}
main()
