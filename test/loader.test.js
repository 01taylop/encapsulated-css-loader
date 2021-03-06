/**
 * @jest-environment node
 */

import compiler from './compiler.js'

const exampleCSS = 'h1 {\\n  color: #FF69B4;\\n}\\n'

test('Encapsulates a css file', async () => {
  const stats = await compiler('example.css', { className: 'test' })
  const output = stats.toJson({ source: true }).modules[0].source

  expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, ".test { ${exampleCSS} }", ""]);`)
})

test('Encapsulates an scss file', async () => {
  const stats = await compiler('example.scss', { className: 'test' })
  const output = stats.toJson({ source: true }).modules[0].source

  expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, ".test { ${exampleCSS} }", ""]);`)
})
