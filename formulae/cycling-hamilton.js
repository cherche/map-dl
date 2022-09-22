const filters = require('../filters')

module.exports = {
  name: 'cycling-hamilton',
  shortName: 'Hamilton',
  site: 'https://www.hamilton.ca/home-neighbourhood/getting-around/biking-cyclists',
  type: 'webscrape',
  scrapeUrl: 'https://www.hamilton.ca/home-neighbourhood/getting-around/biking-cyclists/cycling-routes-maps',
  downloads: [
    {
      id: 'Rural',
      getUrl () {
        const anchors = document.querySelector('.content-wrapper').querySelectorAll('a')
        return anchors[0].href
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
      id: 'Urban',
      getUrl () {
        const anchors = document.querySelector('.content-wrapper').querySelectorAll('a')
        return anchors[1].href
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
  ]
}
