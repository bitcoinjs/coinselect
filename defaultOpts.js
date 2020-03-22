const defaultOpts = {
  changeInputLengthEstimate: 107,
  changeOutputLength: 25,
  lowRSig: false
}

function processOptions (options) {
  const mergerdOptions = Object.assign(defaultOpts, options)
  return mergerdOptions
}

exports.processOptions = processOptions
