import { validate } from 'schema-utils'

import type { Schema } from 'schema-utils/declarations/validate'
import type { LoaderContext } from 'webpack'

const schema: Schema = {
  additionalProperties: false,
  properties: {
    className: {
      description: 'Define the class name in which you would like to encapsulate your CSS.',
      type: 'string',
    },
  },
  required: ['className'],
  type: 'object',
}

interface LoaderOptions {
  className: string
}

function loader(this: LoaderContext<LoaderOptions>, source: string): string {
  const options = this.getOptions()

  validate(schema, options, {
    baseDataPath: 'options',
    name: 'Encapsulated CSS Loader',
  })

  return `.${options.className} { ${source} }`
}

export default loader
