import * as shiki from 'shiki'

export function getAbsoluteWidth(metrics: TextMetrics) {
  return (
    Math.abs(metrics.actualBoundingBoxLeft) +
    Math.abs(metrics.actualBoundingBoxRight)
  )
}

export function getLongestLineLength(
  ctx: CanvasRenderingContext2D,
  lines: shiki.IThemedToken[][],
  fontSize: number
) {
  const previousFont = `${ctx.font}`
  const previousTextBaseline = `${ctx.textBaseline}` as CanvasTextBaseline
  ctx.font = `${fontSize}px monospace`
  ctx.textBaseline = 'top'

  const textLineLengths = lines
    .map((t) => t.map((t) => t.content).join(''))
    .map((t) => getAbsoluteWidth(ctx.measureText(t)))

  ctx.font = previousFont
  ctx.textBaseline = previousTextBaseline

  return Math.max(...textLineLengths)
}

export function getLineHeight(
  ctx: CanvasRenderingContext2D,
  fontSize: number,
  text: string | shiki.IThemedToken[] = 'M'
) {
  const previousFont = `${ctx.font}`
  const previousTextBaseline = `${ctx.textBaseline}` as CanvasTextBaseline
  const line = Array.isArray(text) ? text.map((t) => t.content).join('') : text

  ctx.font = `${fontSize}px monospace`
  ctx.textBaseline = 'top'

  const measurements = ctx.measureText(line)

  ctx.font = previousFont
  ctx.textBaseline = previousTextBaseline

  return (
    measurements.fontBoundingBoxDescent ?? measurements.actualBoundingBoxDescent
  )
}

export function getTextHeight(
  ctx: CanvasRenderingContext2D,
  fontSize: number,
  lines: shiki.IThemedToken[][]
) {
  return lines.reduce((result, line) => {
    const lineContent = line.map((token) => token.content).join('')
    return result + getLineHeight(ctx, fontSize, lineContent)
  }, 0)
}
