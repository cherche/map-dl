const filters = require('../filters')

const name = 'brampton-transit'
const shortName = 'BT'
const url = 'https://www.brampton.ca/EN/residents/transit/plan-your-trip/Pages/Schedules-Maps-Covid.aspx'
const actions = [
  {
    outputSuffix: 'lowres',
    getDownloadUrl() {
      const buttons = document.querySelectorAll('.jumbotron.transit .btn')
      return buttons[1].href
    },
    downloadExtension: 'pdf',
    generateOutput(download, output, outputExtension) {
      filters.pdftoppm({
        input: download,
        output,
        outputExtension,
        page: 1,
        resolution: 10
      })
    }
  }
]

module.exports = {
  name,
  shortName,
  url,
  actions
}
