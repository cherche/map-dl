const filters = require('../filters')

module.exports = {
  name: 'cycling-mississauga',
  shortName: 'Mississauga',
  site: 'https://www.mississaugabikes.ca/',
  type: 'webscrape',
  scrapeUrl: 'https://www.mississaugabikes.ca/cycling-map/',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return document.querySelectorAll('.wpb_wrapper h4')[1].querySelector('a').href
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
