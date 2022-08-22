const filters = require('../filters')

module.exports = {
  name: 'uoft-campus',
  shortName: 'UofTCampus',
  type: 'static',
  download: {
    id: 'default',
    omitId: true,
    url: 'https://www.utoronto.ca/__shared/assets/3D_Map1103.pdf',
    extension: 'pdf',
    outputs: [
      {
        id: 'default',
        omitId: true,
        generate (input, output) {
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
