import { getOptions } from 'loader-utils'
import { validate } from 'schema-utils'

const schema = {
  type: 'object',
  properties: {
    className: {
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
