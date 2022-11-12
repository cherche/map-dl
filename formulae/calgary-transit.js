const filters = require('../filters')

module.exports = {
  name: 'calgary-transit',
  shortName: 'CT',
  site: 'https://www.calgarytransit.com/home.html',
  type: 'webscrape',
  scrapeUrl: 'https://www.calgarytransit.com/content/transit/en/home/rider-information/lrt-and-bus-station-maps.html',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return document.querySelector('a.cui.btn-md.primary.btn-fluid.mb-0').href
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
              resolution: 150
            })
          }
        }
      ]
    }
  ]
}
