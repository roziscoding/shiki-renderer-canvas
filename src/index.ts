import type { Canvas } from 'canvas'
import merge from 'lodash.merge'
import * as shiki from 'shiki'
import { DeepPartial } from './DeepPartial'
import { getLineHeight, getLongestLineLength, getTextHeight } from './math'
import { drawBoundingBox } from './pencil'

type Options = {
  fontSize: number
  padding: {
    vertical: number
    horizontal: number
  }
  backgroundColor: string
  drawPaddingLines: boolean
}

const DEFAULT_OPTIONS: Options = {
  fontSize: 20,
  padding: {
    vertical: 20,
    horizontal: 20
  },
  backgroundColor: '#000',
  drawPaddingLines: false
}

export function getCanvasRenderer<TCanvas extends HTMLCanvasElement | Canvas>(
  canvas: TCanvas,
  options: DeepPartial<Options> = {}
) {
  const config = merge(DEFAULT_OPTIONS, options)
  const { fontSize, padding, backgroundColor } = config

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  if (!ctx) throw new Error('no canvas context')

  return {
    renderToCanvas(tokens: shiki.IThemedToken[][]) {
      const longestLineLength = getLongestLineLength(ctx, tokens, fontSize)

      canvas.width = longestLineLength + padding.horizontal * 2
      canvas.height =
        getTextHeight(ctx, fontSize, tokens) + padding.vertical * 2

      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (config.drawPaddingLines) drawBoundingBox(ctx, padding)

      let y = padding.vertical

      for (const line of tokens) {
        let x = padding.horizontal

        for (const token of line) {
          ctx.font = `${fontSize}px monospace`
          ctx.textBaseline = 'top'
          ctx.fillStyle = token.color || '#fff'
          ctx.fillText(token.content, x, y)

          x += ctx.measureText(token.content).width
        }

        y += getLineHeight(ctx, fontSize, line)
      }

      return canvas
    }
  }
}
