# axe-playground

A series of fixtures meant to violate specific [aXe](https://github.com/dequelabs/axe-core) rules and checks. Supports modification of aXe configuration and re-analysis on the fly.

## Directions

Clone the project using

```bash
$ git clone git@github.com:isner/axe-playground.git
```

then open `/dist/index.html` in your browser.

## Adding an Example

Clone and install the project dependencies using

```bash
$ git clone git@github.com:isner/axe-playground.git
$ cd axe-playground
$ npm i
```

then create or modify jade fixtures in `/src`. The jade templates should extend `/src/fiddle-view.jade`.

Rebuild using

```bash
$ gulp
```
