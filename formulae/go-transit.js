const fs = require('fs')

module.exports = {
  name: 'go-transit',
  shortName: 'GO',
  site: 'https://www.gotransit.com/',
  type: 'static',
  download: {
    id: 'default',
    omitId: true,
    url: 'https://www.gotransit.com/file_source/gotransit/assets/img/maps/system-map.png',
    extension: 'png',
    outputs: [
      {
        id: 'default',
        omitId: true,
        generate: (input, output) => {
          fs.copyFileSync(input, output)
        }
      }
    ]
  }
}
