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
        const accordion = Array.from(document.querySelectorAll('.Accordion'))
          .find(el => el.querySelector('.AccordionTrigger h2 a').name === 'Region-of-Waterloo-Bike-Map')
        const mapLinks = Array.from(accordion.querySelectorAll('.AccordionContent ul li a'), a => a.href)
        return mapLinks[0]
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
        const accordion = Array.from(document.querySelectorAll('.Accordion'))
          .find(el => el.querySelector('.AccordionTrigger h2 a').name === 'Region-of-Waterloo-Bike-Map')
        const mapLinks = Array.from(accordion.querySelectorAll('.AccordionContent ul li a'), a => a.href)
        return mapLinks[1]
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
