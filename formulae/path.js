const filters = require('../filters')

module.exports = {
  name: 'path',
  shortName: 'PATH',
  site: 'https://www.toronto.ca/explore-enjoy/visitor-services/path-torontos-downtown-pedestrian-walkway/',
  type: 'webscrape',
  scrapeUrl: 'https://www.toronto.ca/explore-enjoy/visitor-services/path-torontos-downtown-pedestrian-walkway/',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return document.querySelector('.pagecontent a.btn-primary').href
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
