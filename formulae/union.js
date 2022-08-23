const filters = require('../filters')

module.exports = {
  name: 'union',
  shortName: 'UNION',
  site: 'https://torontounion.ca/',
  type: 'webscrape',
  scrapeUrl: 'https://www.gotransit.com/en/stations-stops-parking/union-station-history-facts-map',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        const headings = document.querySelectorAll('.content-page-content h2.content-section-title')
        const mapHeading = Array.from(headings).filter(el => el.textContent === 'Map')[0]
        const mapParagraph = mapHeading.nextElementSibling.nextElementSibling.nextElementSibling
        return mapParagraph.querySelector('a').href
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
              resolution: 72
            })
          }
        }
      ]
    }
  ]
}
