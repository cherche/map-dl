const fs = require('fs')
const { exec } = require('child_process')

function pdftoppm ({
  input,
  output,
  page,
  resolution
}) {
  // Using tmp/ is tough because there may be name conflicts across formulae
  const tmpPath = `tmp/${output.split('/').join('-')}`
  exec(`pdftoppm ${input} ${tmpPath} -png -f ${page} -singlefile -r ${resolution}`, () => {
    fs.rename(`${tmpPath}.png`, output, err => console.log(err))
  })
}

module.exports = { pdftoppm }
