const filters = require('../filters')

module.exports = {
  name: 'hsr',
  shortName: 'HSR',
  site: 'https://www.hamilton.ca/hsr-bus-schedules-fares',
  type: 'webscrape',
  scrapeUrl: 'https://www.hamilton.ca/hsr-bus-schedules-fares/schedule-routes-maps',
  downloads: [
    {
      id: 'default',
      omitId: true,
      getUrl () {
        return document.querySelector('.pane-content table.views-view-grid tr.row-2 td.col-2 a').href
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
              resolution: 216
            })
          }
        }
      ]
    }
  ]
}
