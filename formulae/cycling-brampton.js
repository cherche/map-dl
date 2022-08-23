const filters = require('../filters')

module.exports = {
  name: 'cycling-brampton',
  shortName: 'Brampton',
  site: 'https://www.brampton.ca/EN/residents/Roads-and-Traffic/Cycling/Pages/Riding-in-Brampton.aspx',
  type: 'static',
  download: {
    id: 'default',
    omitId: true,
    url: 'https://www.brampton.ca/EN/residents/Roads-and-Traffic/Cycling/Documents/Maps/Cycling-Map.pdf',
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
