const filters = require('../filters')

module.exports = {
  name: 'cycling-york',
  shortName: 'York',
  site: 'https://www.york.ca/recreation/cycling',
  type: 'webscrape',
  scrapeUrl: 'https://www.york.ca/transportation/cycling/cycling-maps',
  downloads: [
    {
      id: 'North',
      getUrl () {
        return document.querySelectorAll('details .details-wrapper ul li a')[0].href
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
              resolution: 175
            })
          }
        }
      ]
    },
    {
      id: 'South',
      getUrl () {
        return document.querySelectorAll('details .details-wrapper ul li a')[1].href
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
              resolution: 175
            })
          }
        }
      ]
    }
  ]
}
