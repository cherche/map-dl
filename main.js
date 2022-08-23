const https = require('https')
const fs = require('fs')
const fsPromises = fs.promises

const FORCE_OUTPUT = false
const SKIP_DOWNLOAD = false
// It is important that these are formatted correctly
// Need ./ before formulae_dir
// May or may not need to omit / at the end (honestly not sure)
const FORMULAE_DIR = './formulae'
const DOWNLOADS_DIR = './downloads'
const CACHE_DIR = './cache'
const OUTPUT_DIR = './output'

// Can't believe it's this easy to import all the formulae
const formulae = []
fs.readdirSync(FORMULAE_DIR).forEach((formulaName) => {
  if (formulaName.endsWith('.js')) {
    console.log('Loading formula', formulaName)
    formulae.push(require(`${FORMULAE_DIR}/${formulaName}`))
  }
})

// See https://stackoverflow.com/a/22907134
function download (url, dest, cb) {
  // Force https protocol (if http fails, we'll just give up)
  url = url.replace(/^http:/, 'https:')

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
        console.log(err)
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

// We take downloadUrl separately because of the different structures
// on formulae of type 'static' and type 'webscrape'.
// Another, more hacky, way is to mutate the formula so that for 'webscrape's,
//  formula.download.url = await await page.evaluate(formula.download.getUrl)
async function manageDownload ({ downloadUrl, dl, formula }) {
  const downloadIdStamp = (dl.omitId) ? '' : `-${dl.id}`
  const downloadName = `${formula.shortName}${downloadIdStamp}.${dl.extension}`

  const downloadPath = `${DOWNLOADS_DIR}/${downloadName}`
  const cachePath = `${CACHE_DIR}/${downloadName}`

  if (!SKIP_DOWNLOAD) {
    console.log([`${formula.name}[${dl.id}]`], 'Downloading', { downloadUrl })
    await downloadPromise(downloadUrl, downloadPath)
  }

  try {
    await fsPromises.stat(cachePath)
    // download precisely matches cache---so there's nothing new to bother with
    if (fs.readFileSync(downloadPath).equals(fs.readFileSync(cachePath)) && !FORCE_OUTPUT) {
      console.log([`${formula.name}[${dl.id}]`], 'Skipping since exact match found in cache')
      return
    }
  } catch (err) {
    // file with download name does not exist in cache
    // warning: will run into issues if there is nothing in cache
    if (!SKIP_DOWNLOAD) {
      await fsPromises.rename(downloadPath, cachePath)
    }
  }

  for (const o of dl.outputs) {
    const outputIdStamp = (o.omitId) ? '' : `-${o.id}`
    const output = `${OUTPUT_DIR}/${formula.shortName}${getMonthStamp()}${downloadIdStamp}${outputIdStamp}.png`
    console.log([`${formula.name}[${dl.id}][${o.id}]`], 'Generating output', {
      input: cachePath,
      output
    })
    o.generate(cachePath, output)
  }
}

async function manageWebscrapeDownload ({ dl, formula, page }) {
  // First download to cache
  const downloadUrl = await page.evaluate(dl.getUrl)
  manageDownload({
    downloadUrl,
    dl,
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
        console.log(err)
      }
    }
  },
  async static ({ formula }) {
    const dl = formula.download
    try {
      await manageDownload({ downloadUrl: dl.url, dl, formula })
    } catch (err) {
      console.log('Download failed!', {
        formulaName: formula.name,
        formulaType: formula.type,
        downloadUrl: dl.url
      })
      console.log(err)
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
