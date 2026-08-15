// Turns the user's in-memory arrangement (positions stored as % of a
// responsive square canvas, so it works at any screen size) into two things
// the backend needs at "finalize" time: a real PNG preview image, and the
// same elements expressed in absolute px on a fixed reference grid so saved
// designs render identically no matter what device they were built on.
//
// No extra canvas/animation library required — every placed item is just an
// image, so the native <canvas> 2D API is enough: translate to its center,
// rotate, optionally flip, then draw it centered.

export const KRIYA_REFERENCE_SIZE = 1000;

// Cloudinary serves images with permissive CORS by default, so drawing them
// onto a canvas generally won't taint it. If a particular image ever fails
// to load (network hiccup, a future non-CORS asset host, etc.) we let that
// throw and the caller falls back to submitting without a preview image
// rather than blocking the whole finalize flow.
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });

export const buildKriyaSubmission = async (placed, backgroundColor = '#FFF8EF') => {
  const size = KRIYA_REFERENCE_SIZE;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  const sorted = [...placed].sort((a, b) => a.zIndex - b.zIndex);
  const absoluteElements = [];

  for (const el of sorted) {
    // eslint-disable-next-line no-await-in-loop -- draw order must match layer order
    const img = await loadImage(el.image);
    const aspect = img.naturalHeight / img.naturalWidth || 1;
    const widthPx = (el.widthPct / 100) * size;
    const heightPx = widthPx * aspect;
    const cx = (el.xPct / 100) * size;
    const cy = (el.yPct / 100) * size;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((el.rotation * Math.PI) / 180);
    if (el.flipX) ctx.scale(-1, 1);
    ctx.drawImage(img, -widthPx / 2, -heightPx / 2, widthPx, heightPx);
    ctx.restore();

    absoluteElements.push({
      element: el.elementId,
      image: el.image,
      x: cx,
      y: cy,
      width: widthPx,
      height: heightPx,
      rotation: el.rotation,
      zIndex: el.zIndex,
      flipX: el.flipX,
    });
  }

  const previewBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.92));

  return {
    previewBlob, // may be null if canvas.toBlob is unsupported — caller should handle that
    absoluteElements,
    canvasSize: { width: size, height: size },
  };
};
