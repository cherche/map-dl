const filters = require('../filters')

module.exports = {
  name: 'cycling-hamilton',
  shortName: 'Hamilton',
  site: 'https://www.hamilton.ca/streets-transportation/biking-cyclists/',
  type: 'webscrape',
  scrapeUrl: 'https://www.hamilton.ca/streets-transportation/biking-cyclists/cycling-routes-maps',
  downloads: [
    {
      id: 'Urban',
      getUrl () {
        const mapList = document.querySelector('.pane-content .pane-content ul')
        return mapList.querySelectorAll('li a')[0].href
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
      id: 'Rural',
      getUrl () {
        const mapList = document.querySelector('.pane-content .pane-content ul')
        return mapList.querySelectorAll('li a')[1].href
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
