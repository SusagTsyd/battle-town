
export default function uiBgRenderer(ctx, size) {
  return () => {
    const uiWidth = size.pixelWidth - size.uiX;

    ctx.fillStyle = 'black';
    ctx.fillRect(size.uiX, 0, uiWidth, size.pixelHeight);
  };
}
