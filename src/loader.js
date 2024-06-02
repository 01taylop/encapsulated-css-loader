const { validate } = require('schema-utils')

const schema = {
  additionalProperties: false,
  properties: {
    className: {
      description: 'Define the class name in which you would like to encapsulate your css.',
      type: 'string',
    },
  },
  type: 'object',
}

module.exports = function (source) {
  const options = this.getOptions()

  validate(schema, options, {
    baseDataPath: 'options',
    name: 'Encapsulated CSS Loader',
  })

  if (!options.className || typeof options.className !== 'string') {
    throw new Error('className must be provided and must be a string')
  }

  return `.${options.className} { ${source} }`
}
