shiki-renderer-canvas
---

A Canvas renderer for [Shiki](https://github.com/shikijs/shiki) that works on the browser or in Node.js


## Installation

```sh
npm i shiki-renderer-canvas
```

## Usage

### Node.js

```typescript
import { createCanvas } from 'canvas'
import { writeFile } from 'fs/promises'
import * as shiki from 'shiki'
import { getCanvasRenderer } from '.'

const text = `
import { createCanvas } from 'canvas'
import * as shiki from 'shiki'
type Options = any

export function getCanvasRenderer(_options?: Options) {
  const canvas = createCanvas(500, 500)
  const ctx = canvas.getContext('2d')

  return {
    renderToCanvas(tokens: shiki.IThemedToken[][]) {
      const [line] = tokens
      const [token] = line

      ctx.strokeStyle = token.color!
      ctx.fillText(token.content, 0, 0)

      ctx.stroke()

      return canvas.toBuffer()
    }
  }
}
`.trim()

;(async () => {
  const canvas = createCanvas(500, 500)
  const highlighter = await shiki.getHighlighter({ theme: 'dracula' })
  const tokens = highlighter.codeToThemedTokens(text, 'typescript')
  const renderer = getCanvasRenderer(canvas)
  const buffer = renderer.renderToCanvas(tokens).toBuffer()
  await writeFile('image.png', buffer)
})()
```


### Browser

```typescript
import * as shiki from 'shiki'
import { getCanvasRenderer } from './renderer/index'
import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')
const codeEl = document.querySelector<HTMLTextAreaElement>('#code')
const tokensEl = document.querySelector<HTMLTextAreaElement>('#tokens')
const drawPaddingLinesEl = document.querySelector<HTMLInputElement>('#drawBox')
const fontSizeEl = document.querySelector<HTMLInputElement>('#fontSize')

if (!canvas) throw new Error('no canvas element')
if (!codeEl) throw new Error('no code element')
if (!tokensEl) throw new Error('no tokens element')
if (!drawPaddingLinesEl) throw new Error('no drawBox element')
if (!fontSizeEl) throw new Error('no fontSize element')

shiki.setCDN('https://unpkg.com/shiki/')
const highlighter = await shiki.getHighlighter({ theme: 'dracula' })

const render = async () => {
  const code = codeEl.value.trim()

  const tokens = highlighter.codeToThemedTokens(code, 'typescript')

  tokensEl.value = JSON.stringify(tokens, null, 2)

  const renderer = getCanvasRenderer(canvas, {
    drawPaddingLines: drawPaddingLinesEl.checked,
    fontSize: parseInt(fontSizeEl.value, 10)
  })
  renderer.renderToCanvas(tokens)
}

codeEl.addEventListener('keyup', render)
drawPaddingLinesEl.addEventListener('change', render)
fontSizeEl.addEventListener('change', render)

render()
```
