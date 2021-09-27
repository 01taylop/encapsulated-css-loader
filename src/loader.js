const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils')

const schema = {
  additionalProperties: false,
  type: 'object',
  properties: {
    className: {
      description: 'Define the class name in which you would like to encapsulate your css.',
      type: 'string',
    },
  },
}

module.exports = function (source) {
  const options = getOptions(this)

  validate(schema, options, {
    name: 'Encapsulated CSS Loader',
    baseDataPath: 'options',
  })

  return `.${options.className} { ${source} }`
}
