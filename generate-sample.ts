import fs from 'fs/promises'
import path from 'path'
import { getHighlighter } from 'shiki'
import { createCanvas, registerFont } from 'canvas'
import { getCanvasRenderer } from './src'

const render = async (fontFamily?: string) => {
  const code = await fs.readFile(path.join(__dirname, 'src/index.ts'), 'utf8')

  const highlighter = await getHighlighter({
    langs: ['typescript'],
    theme: 'dracula'
  })

  const canvas = createCanvas(1, 1)
  const renderer = getCanvasRenderer(canvas, {
    font: { family: fontFamily }
  })

  const tokens = highlighter.codeToThemedTokens(code, 'typescript')

  const image = await renderer.renderToCanvas(tokens)
  await fs.writeFile(path.join(__dirname, 'sample.png'), image.toBuffer())
}

if (process.argv.length > 2) {
  const fontPath = path.resolve(process.argv[2])
  const fontName = path.basename(fontPath, path.extname(fontPath))

  console.log(`Registering font at ${fontPath} as ${fontName}`)
  registerFont(fontPath, { family: fontName })
  render(fontName)
} else {
  render()
}
