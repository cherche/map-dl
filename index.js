const fs = require('fs')
const fsPromises = fs.promises
const { log } = require('./js/loggers')
const { downloadPromise } = require('./js/download')
const { getMonthStamp } = require('./js/filename-utils')

const config = require('./config.json')

// If PREFER_CACHE is true, only download file
// if file of same name does not already exist in cache.
// This is great for debugging only specific downloads
const PREFER_CACHE = config.preferCache
// If FORCE_OUTPUT is true, emit an output regardless
// of whether the download is new or not.
// This is great for debugging output generators
const FORCE_OUTPUT = config.forceOutput
// Notice what this means if PREFER_CACHE and FORCE_OUTPUT are both true
// In this case, every output is produced with no "unnecessary" downloads
// This is great for debugging certain downloads AND their output generators
// If KEEP_DOWNLOADS is true, the program will delete
// downloads as soon as they are processed
const KEEP_DOWNLOADS = config.keepDownloads

// It is important that these paths are formatted correctly
// Need ./ before formulae_dir
// May or may not need to omit / at the end (honestly not sure)
const FORMULAE_DIR = config.formulaeDir || './formulae'
const DOWNLOADS_DIR = config.downloadsDir || './downloads'
const CACHE_DIR = config.cacheDir || './cache'
const OUTPUT_DIR = config.outputDir || './output'

// Can't believe it's this easy to import all the formulae
const formulae = []
fs.readdirSync(FORMULAE_DIR).forEach((formulaName) => {
  if (formulaName.endsWith('.js')) {
    console.log('Loading formula', formulaName)
    formulae.push(require(`${FORMULAE_DIR}/${formulaName}`))
  }
})

// We take downloadUrl separately because of the different structures
// on formulae of type 'static' and type 'webscrape'.
// Another (hackier) approach for 'webscrape' is to mutate the formula so that
// formula.download.url = await await page.evaluate(formula.download.getUrl)
async function manageDownload ({ downloadUrl, dl, formula }) {
  const downloadIdStamp = (dl.omitId) ? '' : `-${dl.id}`
  const downloadName = `${formula.shortName}${downloadIdStamp}.${dl.extension}`

  const downloadPath = `${DOWNLOADS_DIR}/${downloadName}`
  const cachePath = `${CACHE_DIR}/${downloadName}`

  let preferCache = false
  let emitOutput = true

  if (PREFER_CACHE) {
    try {
      await fsPromises.stat(cachePath)
      log('Using available cache instead of downloading (preferCache=true)', { formula, dl })
      preferCache = true
      emitOutput = false
    } catch (err) {}
  }

  if (!preferCache) {
    log('Downloading', { downloadUrl }, { formula, dl })
    try {
      await downloadPromise(downloadUrl, downloadPath)
    } catch (err) {
      // If a download fails, the other downloads can still keep going!
      log('ERROR:', err, { formula, dl })
      return
    }

    try {
      if (fs.readFileSync(downloadPath).equals(fs.readFileSync(cachePath))) {
        log('Leaving as-is; download matches cache (no updates)', { formula, dl })
        // Since download precisely matches cache, avoid emitting output (unless forced)
        emitOutput = false
        if (!KEEP_DOWNLOADS) {
          // Get rid of the download to save storage space
          log('Deleting download to save space (keepDownloads=false)', { formula, dl })
          await fsPromises.unlink(downloadPath)
        }
      } else {
        log('Overwriting cache with updated download', { formula, dl })
        await fsPromises.rename(downloadPath, cachePath)
      }
    } catch (err) {
      // Notice that we already downloaded to downloadPath, hence any error arising
      // in the try-block above must be due to `fs.readFileSync(cachePath)`
      log('Moving new download to cache', { formula, dl })
      await fsPromises.rename(downloadPath, cachePath)
    }
  }

  // Could expand with De Morgan's laws ... but I think this is easier to understand!
  if (!(emitOutput || FORCE_OUTPUT)) return

  for (const o of dl.outputs) {
    const outputIdStamp = (o.omitId) ? '' : `-${o.id}`
    const output = `${OUTPUT_DIR}/${formula.shortName}${getMonthStamp()}${downloadIdStamp}${outputIdStamp}.png`
    log('Generating output', {
      input: cachePath,
      output
    }, { formula, dl, o })
    o.generate(cachePath, output)

    // TODO: Set creation/modification date many years in the past
    // so that maps do not clutter recent photos on phone
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
