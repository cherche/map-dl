const filters = require('../filters')

module.exports = {
  name: 'yrt',
  shortName: 'YRT',
  site: 'https://www.yrt.ca/en/index.aspx',
  type: 'webscrape',
  scrapeUrl: 'https://www.yrt.ca/en/schedules-and-maps/system-map.aspx',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return document.querySelectorAll('#printAreaContent div > ul > li > a')[0].href
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
              resolution: 167
            })
          }
        }
      ]
    },
    {
      id: 'Viva',
      getUrl () {
        return document.querySelectorAll('#printAreaContent div > ul > li > a')[1].href
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
              resolution: 120
            })
          }
        }
      ]
    }
  ]
}
