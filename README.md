# Encapsulated CSS Loader

[![CodeQL Analysis](https://github.com/01taylop/encapsulated-css-loader/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/01taylop/encapsulated-css-loader/actions/workflows/codeql-analysis.yml)
[![Test](https://github.com/01taylop/encapsulated-css-loader/actions/workflows/test.yml/badge.svg)](https://github.com/01taylop/encapsulated-css-loader/actions/workflows/test.yml)

A Webpack loader to encapsulate CSS with a given class name.

- [Motivation](#motivation)
- [What does the `encapsulated-css-loader` do?](#what-does-the-encapsulated-css-loader-do)
- [Why use `encapsulated-css-loader`?](#why-use-encapsulated-css-loader)
- [How to use `encapsulated-css-loader`](#how-to-use-encapsulated-css-loader)

## Motivation

## What does the `encapsulated-css-loader` do?

The `encapsulated-css-loader` takes uncompiled CSS (or SCSS) and encapsulates it with a given class name.

**example.scss**

```.scss
h1 {
  color: red;
}

.example {
  background-color: #FF69B4;

  p {
    color: #570861;
  }
}
```

**example.scss after encapsulation, passing "test" as the class name**

```.css
.test h1 {
  color: red;
}

.test .example {
  background-color: #FF69B4;
}

.test .example p {
  color: #570861;
}
```

_The loader does not work for SASS files._

## Why use `encapsulated-css-loader`?

This Webpack loader was created as a temporary solution for a very specific use-case.

The project in question utilises Webpack 5's Module Federation as part of a Micro-Frontend architecture. The Webpack configuration is abstracted out into a `devDependency` which many teams use to build and deploy components to the "shell". Many components can be rendered on a single page and there is no guarantee that one component's CSS has been encapsulated. Whilst [CSS Modules](https://css-tricks.com/css-modules-part-1-need/) would add value, if a component changes the style of an element, e.g. the `h1` tag in the example above, this change would be global, overwriting the style of other components or even the "shell" itself.

When factoring in the number of teams, number of components, and the uncertainty of third-party libraries, encapsulating the css at the highest level - in the Webpack configuration - was considered the fastest and safest solution.

## How to use `encapsulated-css-loader`

Webpack loaders run in reverse order; from bottom to top. In the example below, the `encapsulated-css-loader` runs first, passing in the `className` of "test". This will encapsulate any CSS or SCSS file with the "test" class, as shown in the example above.

The loader does the most basic implementation possible and simply wraps the source of the file in the class name provided - in SCSS. **Therefore, the next loader must be the `sass-loader` - even if you are not using SCSS in your project.**

The next loaders are fairly basic and you can configure those to meet your requirements.

```webpack.config.js
{
  module: {
    rules: [

      // Bundle styles and process with PostCSS.
      {
        test: /\.(sc|c)ss$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: ['postcss-preset-env'] } } },
          { loader: 'sass-loader', options: { sourceMap: true } },
          { loader: 'encapsulated-css-loader', options: { className: 'test' } },
        ],
      },

    ]
  }
}
```
