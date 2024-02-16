const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const tmp = require('tmp')

async function nofilter({ input, output }) {
  fs.renameSync(input, output, err => console.log(err))
}

async function pdftoppm ({
  input,
  output,
  page,
  resolution
}) {
  const tmpPath = tmp.tmpNameSync('tmp')
  await exec(`pdftoppm ${input} ${tmpPath} -png -f ${page} -singlefile -r ${resolution}`)
  fs.renameSync(`${tmpPath}.png`, output, err => console.log(err))
}

module.exports = { nofilter, pdftoppm }
