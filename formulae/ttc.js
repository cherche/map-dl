const filters = require('../filters')

module.exports = {
  name: 'ttc',
  shortName: 'TTC',
  site: 'https://www.ttc.ca/',
  type: 'webscrape',
  scrapeUrl: 'https://www.ttc.ca/routes-and-schedules/#/',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        const links = document.querySelectorAll('.c-route-maps__download a')
        return links[1].href
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
              resolution: 225
            })
          }
        }
      ]
    }
  ]
}
