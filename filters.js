const { exec } = require('child_process')

function pdftoppm ({
  input,
  outputName,
  outputExtension,
  page,
  resolution
}) {
  exec(`pdftoppm ${input} ${outputName} -${outputExtension} -f ${page} -singlefile -r ${resolution}`)
}

module.exports = { pdftoppm }
