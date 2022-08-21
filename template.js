const filters = require('../filters')

const formula1 = {
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
            const outputParts = output.split('.')
            const outputName = outputParts.slice(0, -1).join('.')
            const outputExtension = outputParts[outputParts.length - 1]
            filters.pdftoppm({
              input,
              outputName,
              outputExtension,
              page: 1,
              resolution: 10
            })
          }
        }
      ]
    }
  ]
}

const formula2 = {
  name: 'uoft-campus',
  shortName: 'UofTCampus',
  type: 'static',
  download: {
    url: 'https://www.utoronto.ca/__shared/assets/3D_Map1103.pdf',
    extension: 'pdf',
    outputs: [
      {
        id: 'default',
        omitId: true,
        generate (input, output) {
          const outputParts = output.split('.')
          const outputName = outputParts.slice(0, -1).join('.')
          const outputExtension = outputParts[outputParts.length - 1]
          filters.pdftoppm({
            input,
            outputName,
            outputExtension,
            page: 1,
            resolution: 10
          })
        }
      }
    ]
  }
}
