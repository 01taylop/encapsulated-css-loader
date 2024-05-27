import compiler from './compiler.js'

describe('loader', () => {

  const exampleCSS = 'h1 {\\n  color: #FF69B4;\\n}\\n'

  it('encapsulates a css file', async () => {
    const stats = await compiler('example.css', { className: 'test' })
    const output = stats.toJson({ source: true }).modules[0].source

    expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, ".test { ${exampleCSS} }", ""]);`)
  })

  it('encapsulates an scss file', async () => {
    const stats = await compiler('example.scss', { className: 'test' })
    const output = stats.toJson({ source: true }).modules[0].source

    expect(output).toContain(`___CSS_LOADER_EXPORT___.push([module.id, ".test { ${exampleCSS} }", ""]);`)
  })

})
