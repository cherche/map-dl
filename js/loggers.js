module.exports.log = function log () {
  const args = Array.from(arguments).slice(0, -1)
  const { formula, dl, o } = arguments[arguments.length - 1]

  const dlIdStamp = dl ? `/${dl.id}` : ''
  const oIdStamp = o ? `/${o.id}` : ''
  console.log([`${formula.name}${dlIdStamp}${oIdStamp}`], ...args)
}
