const filters = require('../filters')

module.exports = {
  name: 'cycling-toronto',
  shortName: 'Toronto',
  site: 'https://www.toronto.ca/services-payments/streets-parking-transportation/cycling-in-toronto/',
  type: 'webscrape',
  scrapeUrl: 'https://www.toronto.ca/services-payments/streets-parking-transportation/cycling-in-toronto/cycling-network-map/',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return document.querySelector('a[title="PDF Document"]').href
      },
      extension: 'pdf',
      outputs: [
        {
          id: 'default',
          omitId: true,
          generate: (input, output) => {
            filters.pdftoppm({
              input,
              output,
              page: 1,
              resolution: 240
            })
          }
        }
      ]
    }
  ]
}
