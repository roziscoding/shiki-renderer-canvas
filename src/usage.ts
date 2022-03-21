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
