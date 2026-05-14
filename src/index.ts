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
    strategy: {
      description: "Define the scoping strategy: 'class' (default) wraps CSS in a class selector, 'scope' uses the native CSS @scope rule.",
      enum: ['class', 'scope'],
      type: 'string',
    },
  },
  required: ['className'],
  type: 'object',
}

interface LoaderOptions {
  className: string
  strategy?: 'class' | 'scope'
}

const AT_RULE_PATTERN = /^[ \t]*@(?:use|forward|import|charset)[^;]*;[ \t]*\n?/gm

function extractTopLevelAtRules(source: string): { atRules: string; remainder: string } {
  const atRules: string[] = []
  const remainder = source.replace(AT_RULE_PATTERN, (match) => {
    atRules.push(match.trimEnd())
    return ''
  })
  return {
    atRules: atRules.join('\n'),
    remainder,
  }
}

function loader(this: LoaderContext<LoaderOptions>, source: string): string {
  const options = this.getOptions()

  validate(schema, options, {
    baseDataPath: 'options',
    name: 'Encapsulated CSS Loader',
  })

  const strategy = options.strategy ?? 'class'
  const { atRules, remainder } = extractTopLevelAtRules(source)

  const wrapper =
    strategy === 'scope'
      ? `@scope (.${options.className}) { ${remainder} }`
      : `.${options.className} { ${remainder} }`

  return atRules ? `${atRules}\n\n${wrapper}` : wrapper
}

export default loader
