const filters = require('../filters')

module.exports = {
  name: 'cycling-mississauga',
  shortName: 'Mississauga',
  site: 'https://mississauga.ca/services-and-programs/transportation-and-streets/cycling/',
  type: 'webscrape',
  scrapeUrl: 'https://www.mississauga.ca/services-and-programs/transportation-and-streets/cycling/cycling-map/',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return Array.from(document.querySelectorAll('a.btn')).find(el => el.textContent === 'Download map').href
      },
      extension: 'pdf',
      outputs: [
        {
          id: 'North',
          generate: (input, output) => {
            filters.pdftoppm({
              input,
              output,
              page: 1,
              resolution: 200
            })
          }
        },
        {
          id: 'South',
          generate: (input, output) => {
            filters.pdftoppm({
              input,
              output,
              page: 2,
              resolution: 200
            })
          }
        }
      ]
    }
  ]
}
