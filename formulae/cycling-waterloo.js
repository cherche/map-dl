const filters = require('../filters')

module.exports = {
  name: 'cycling-waterloo',
  shortName: 'Waterloo',
  site: 'https://www.regionofwaterloo.ca/en/living-here/cycling-and-walking.aspx',
  type: 'webscrape',
  scrapeUrl: 'https://www.regionofwaterloo.ca/en/living-here/cycling-and-walking.aspx',
  downloads: [
    {
      id: 'Rural',
      getUrl () {
        const headings = document.querySelectorAll('#printArea h3')
        const mapHeading = Array.from(headings).filter((el) => {
          return el.textContent === 'Region of Waterloo Bike Map'
        })[0]
        let sibling = mapHeading
        while (sibling.tagName !== 'UL') {
          sibling = sibling.nextElementSibling
        }
        const mapLinks = sibling.querySelectorAll('li a')
        return mapLinks[0].href
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
        const headings = document.querySelectorAll('#printArea h3')
        const mapHeading = Array.from(headings).filter((el) => {
          return el.textContent === 'Region of Waterloo Bike Map'
        })[0]
        let sibling = mapHeading
        while (sibling.tagName !== 'UL') {
          sibling = sibling.nextElementSibling
        }
        const mapLinks = sibling.querySelectorAll('li a')
        return mapLinks[1].href
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
