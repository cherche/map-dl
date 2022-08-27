// https://stackoverflow.com/a/41407246
const Reset = '\x1b[0m'
const Dim = "\x1b[2m"
const FgBlue = "\x1b[34m"

module.exports.log = function log () {
  const args = Array.from(arguments).slice(0, -1)
  const { formula, dl, o } = arguments[arguments.length - 1]

  const dlIdStamp = dl ? `/${dl.id}` : ''
  const oIdStamp = o ? `/${o.id}` : ''
  console.log(`[${FgBlue}${formula.name}${Dim}${dlIdStamp}${oIdStamp}${Reset}]`, ...args)
}
