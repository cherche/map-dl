const filters = require('../filters')

module.exports = {
  name: 'miway',
  shortName: 'MT',
  site: 'https://www.mississauga.ca/miway-transit/',
  type: 'webscrape',
  scrapeUrl: 'https://www.mississauga.ca/miway-transit/maps/transit-system-maps/',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return document.querySelectorAll('section.module-content-main a')[0].href
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
    },
    {
      id: 'Express',
      getUrl () {
        return document.querySelectorAll('section.module-content-main a')[1].href
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
    },
    {
      id: 'Saturday',
      getUrl () {
        return document.querySelectorAll('section.module-content-main a')[2].href
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
              resolution: 180
            })
          }
        }
      ]
    },
    {
      id: 'Sunday',
      getUrl () {
        return document.querySelectorAll('section.module-content-main a')[3].href
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
              resolution: 180
            })
          }
        }
      ]
    }
  ]
}
