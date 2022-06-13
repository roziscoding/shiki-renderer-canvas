import type { Canvas } from 'canvas'
import merge from 'lodash.merge'
import * as shiki from 'shiki'
import { DeepPartial } from './DeepPartial'
import { getLineHeight, getLongestLineLength, getTextHeight } from './math'
import { drawBoundingBox } from './pencil'

const DEFAULT_OPTIONS = {
  fontSize: 20,
  fontFamily: 'monospace',
  padding: {
    vertical: 20,
    horizontal: 20
  },
  backgroundColor: '#000',
  drawPaddingLines: false
}

export type CanvasRendererOptions = typeof DEFAULT_OPTIONS

export function getCanvasRenderer<TCanvas extends HTMLCanvasElement | Canvas>(
  canvas: TCanvas,
  options: DeepPartial<CanvasRendererOptions> = {}
) {
  const config = merge(DEFAULT_OPTIONS, options)
  const { fontSize, fontFamily, padding, backgroundColor } = config

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  if (!ctx) throw new Error('no canvas context')

  return {
    renderToCanvas(tokens: shiki.IThemedToken[][]) {
      const longestLineLength = getLongestLineLength(
        ctx,
        tokens,
        fontSize,
        fontFamily
      )

      canvas.width = longestLineLength + padding.horizontal * 2
      canvas.height =
        getTextHeight(ctx, fontSize, fontFamily, tokens) + padding.vertical * 2

      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (config.drawPaddingLines) drawBoundingBox(ctx, padding)

      let y = padding.vertical

      for (const line of tokens) {
        let x = padding.horizontal

        for (const token of line) {
          ctx.font = `${fontSize}px ${fontFamily}`
          ctx.textBaseline = 'top'
          ctx.fillStyle = token.color || '#fff'
          ctx.fillText(token.content, x, y)

          x += ctx.measureText(token.content).width
        }

        y += getLineHeight(ctx, fontSize, fontFamily, line)
      }

      return canvas
    }
  }
}
