const defaultOpts = {
  changeInputLengthEstimate: 107,
  changeOutputLength: 25
}

function processOptions (options) {
  const mergerdOptions = Object.assign(defaultOpts, options)
  return mergerdOptions
}

exports.processOptions = processOptions
