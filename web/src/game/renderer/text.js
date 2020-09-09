
export function renderText(ctx, text, x, y, options) {
  options = options || {};

  const fontSize = options.size || 15;

  ctx.font = `${fontSize}px monospace`;

  ctx.lineWidth = 5;

  if (options.center) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }

  if (options.stroke) {
    ctx.strokeStyle = 'white';
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = options.stroke ? 'black' : 'white';
  ctx.fillText(text, x, y);

  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';

  ctx.lineWidth = 1;
}

export const OFFSET_Y = 15;
