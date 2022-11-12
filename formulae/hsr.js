const filters = require('../filters')

module.exports = {
  name: 'hsr',
  shortName: 'HSR',
  site: 'https://www.hamilton.ca/hsr-bus-schedules-fares',
  type: 'webscrape',
  // Why did the Hamilton website remove the HSR System Map 💔
  scrapeUrl: 'https://moovitapp.com/index/en/public_transit-Offline_maps_HSR_System_Map-map-Toronto_ON-143-902',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return document.querySelector('a[data-automation="download-button"]').href
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
              resolution: 216
            })
          }
        }
      ]
    }
  ]
}
