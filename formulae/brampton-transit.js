const filters = require('../filters')

module.exports = {
  name: 'brampton-transit',
  shortName: 'BT',
  site: 'https://www.brampton.ca/en/residents/transit/Pages/home.aspx',
  type: 'webscrape',
  scrapeUrl: 'https://www.brampton.ca/EN/residents/transit/plan-your-trip/Pages/Schedules-Maps-Covid.aspx',
  downloads: [
    {
      getUrl () {
        const buttons = document.querySelectorAll('.jumbotron.transit .btn')
        return buttons[1].href
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
              resolution: 10
            })
          }
        }
      ]
    }
  ]
}
