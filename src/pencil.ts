export function drawLine(
  ctx: CanvasRenderingContext2D,
  color: string,
  from: { x: number; y: number },
  to: { x: number; y: number }
) {
  ctx.lineWidth = 1
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}

export function getPencil(ctx: CanvasRenderingContext2D, color: string) {
  return (from: { x: number; y: number }, to: { x: number; y: number }) =>
    drawLine(ctx, color, from, to)
}

export function drawBoundingBox(
  ctx: CanvasRenderingContext2D,
  padding: { vertical: number; horizontal: number }
) {
  const drawBoundingLine = getPencil(ctx, 'red')

  drawBoundingLine(
    { x: padding.horizontal, y: 0 },
    { x: padding.horizontal, y: ctx.canvas.height }
  )

  drawBoundingLine(
    { x: ctx.canvas.width - padding.horizontal, y: 0 },
    { x: ctx.canvas.width - padding.horizontal, y: ctx.canvas.height }
  )

  drawBoundingLine(
    { x: 0, y: padding.vertical },
    { x: ctx.canvas.width, y: padding.vertical }
  )

  drawBoundingLine(
    { x: 0, y: ctx.canvas.height - padding.vertical },
    { x: ctx.canvas.width, y: ctx.canvas.height - padding.vertical }
  )
}
