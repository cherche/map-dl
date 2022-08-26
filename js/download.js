const https = require('https')
const http = require('http')
const fs = require('fs')

// See https://stackoverflow.com/a/22907134
function download (url, dest, cb) {
  let protocol = https
  if (url.startsWith('http://')) protocol = http

  const file = fs.createWriteStream(dest, cb)
  protocol.get(url, (response) => {
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
