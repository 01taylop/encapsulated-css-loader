import loader from '..'

describe('loader', () => {

  const getOptions = jest.fn()
  const mockContext = { getOptions } as unknown as ThisParameterType<typeof loader>

  it('throws error when className is missing', () => {
    getOptions.mockReturnValue({})

    expect(() => {
      loader.call(mockContext, 'h1 { color: red; }')
    }).toThrow()
  })

  it('throws an error when className is not a string', () => {
    getOptions.mockReturnValue({ className: 123 })

    expect(() => {
      loader.call(mockContext, 'h1 { color: red; }')
    }).toThrow(/should be a string/)
  })

  it('encapsulates CSS with the specified class name', () => {
    getOptions.mockReturnValue({ className: 'test' })

    const source = 'h1 { color: red; }'
    const result = loader.call(mockContext, source)

    expect(result).toBe('.test { h1 { color: red; } }')
  })

  it('handles empty CSS', () => {
    getOptions.mockReturnValue({ className: 'test' })

    const result = loader.call(mockContext, '')

    expect(result).toBe('.test {  }')
  })

  it('preserves CSS formatting', () => {
    getOptions.mockReturnValue({ className: 'wrapper' })

    const source = 'h1 {\n  color: blue;\n  font-size: 16px;\n}'
    const result = loader.call(mockContext, source)

    expect(result).toBe(`.wrapper { ${source} }`)
  })

})
