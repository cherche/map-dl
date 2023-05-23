const filters = require('../filters')

module.exports = {
  name: 'union',
  shortName: 'UNION',
  site: 'https://torontounion.ca/',
  type: 'static',
  download: {
    id: 'default',
    omitId: true,
    url: 'https://torontounion.ca/wp-content/uploads/2022/06/867-26-UnionMap_20220510_N2.pdf',
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
}
