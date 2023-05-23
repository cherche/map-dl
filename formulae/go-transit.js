const fs = require('fs')

module.exports = {
  name: 'go-transit',
  shortName: 'GO',
  site: 'https://www.gotransit.com/',
  type: 'webscrape',
  scrapeUrl: 'https://www.gotransit.com/en/system-map',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        const srcSet = document.querySelector('img[alt="System Map"]').srcset.split(', ')
        // e.g. "https://example.com/image.png 640w" => "https://example.com/image.png"
        const urls = srcSet.map(srcPair => srcPair.split(' ')[0])
        // Get last (best quality)
        return urls.slice(-1)[0]
      },
      extension: 'png',
      outputs: [
        {
          id: 'default',
          omitId: true,
          generate: (input, output) => {
            fs.copyFileSync(input, output)
          }
        }
      ]
    }
  ]
}
