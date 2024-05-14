const filters = require('../filters')

module.exports = {
  name: 'campus-uqac',
  shortName: 'UQAC',
  site: 'https://www.uqac.ca/',
  type: 'static',
  download: {
    id: 'default',
    omitId: true,
    url: 'https://www.uqac.ca/medias/documents/campus/plan_campus.pdf',
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
            resolution: 300
          })
        }
      }
    ]
  }
}
