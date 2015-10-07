# axe-playground

Place to make fixtures for testing axe rules and checks in isolation.

## Viewing Existing Examples

1. Clone axe-playground.
2. Open `/dist/checks/*.html` in your browser.

## Adding an Example

1. Clone axe-playground. 
2. Move to project directory (`$ cd axe-playground`).
3. Install dependencies (`$ npm i`).
4. Create a new jade fixture in `/src`. It should extend `/src/layout.jade`.
5. Rebuild all fixtures (`$ gulp`).