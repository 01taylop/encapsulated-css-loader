import loaderESM from '../lib/index.js'

import { compiler } from './compiler'

import type { StatsError } from 'webpack'

// @ts-ignore - CJS build doesn't have type definitions
const { default: loaderCJS } = await import('../lib/index.cjs')

describe.each([
  ['ESM', loaderESM, '../lib/index.js'],
  ['CJS', loaderCJS, '../lib/index.cjs'],
])('Integration tests - %s', (_format, loader, loaderPath) => {

  const EXAMPLE_CSS = 'h1 {\n  color: #FF69B4;\n}\n'

  test('importing the loader', () => {
    expect(loader).toBeDefined()
    expect(typeof loader).toBe('function')
  })

  test('throwing an error when className is not provided', async () => {
    expect.assertions(1)

    try {
      await compiler(loaderPath, 'example.css', {})
    } catch (error) {
      expect((error as StatsError[])[0].message).toContain('Error')
    }
  })

  test('encapsulating a css file', async () => {
    expect.assertions(1)

    const stats = await compiler(loaderPath, 'example.css', { className: 'test' })
    const output = stats.toJson({ source: true }).modules?.[0]?.source

    expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, \`.test { ${EXAMPLE_CSS} }\`, ""]);`)
  })

  test('encapsulating an scss file', async () => {
    expect.assertions(1)

    const stats = await compiler(loaderPath, 'example.scss', { className: 'test' })
    const output = stats.toJson({ source: true }).modules?.[0]?.source

    expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, \`.test { ${EXAMPLE_CSS} }\`, ""]);`)
  })

})
