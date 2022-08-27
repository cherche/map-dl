const https = require('https')
const fs = require('fs')

// See https://stackoverflow.com/a/22907134
function download (url, dest, cb) {
  // I tried to use http with such urls but for whatever reason
  // the stream would always end up empty! I swear http and https
  // had the same interface. What gives???
  // So for now, we will just force https instead
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

module.exports = {
  download,
  downloadPromise
}
