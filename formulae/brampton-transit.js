const filters = require('../filters')

module.exports = {
  name: 'brampton-transit',
  shortName: 'BT',
  site: 'https://www1.brampton.ca/EN/residents/transit/',
  type: 'webscrape',
  scrapeUrl: 'https://www1.brampton.ca/EN/residents/transit/plan-your-trip/Pages/Schedules-and-Maps.aspx',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return document.querySelector('.card-body > .btn').href
      },
      extension: 'jpg',
      outputs: [
        {
          id: 'default',
          omitId: true,
          generate: (input, output) => {
            filters.nofilter({ input, output })
          }
        }
      ]
    }
  ]
}
