const { exec } = require('child_process')

function pdftoppm ({
  input,
  output,
  outputExtension,
  page,
  resolution
}) {
  exec(`pdftoppm ${input} ${output} -${outputExtension} -f ${page} -singlefile -r ${resolution}`)
}

module.exports = { pdftoppm }
