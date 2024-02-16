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
        const query = 'section.module-content-main ul > li > a'
        const anchors = [...document.querySelectorAll(query)]
        return anchors.find(a => a.textContent === 'Weekday map').href
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
        const query = 'section.module-content-main ul > li > a'
        const anchors = [...document.querySelectorAll(query)]
        return anchors.find(a => a.textContent === 'Express weekday map').href
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
        const query = 'section.module-content-main ul > li > a'
        const anchors = [...document.querySelectorAll(query)]
        return anchors.find(a => a.textContent === 'Saturday map').href
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
        const query = 'section.module-content-main ul > li > a'
        const anchors = [...document.querySelectorAll(query)]
        return anchors.find(a => a.textContent === 'Sunday map').href
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
