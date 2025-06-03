// use cloudinary url to get the image
function transformImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;

  if (!imageUrl.includes('cloudinary')) return imageUrl;

  const uploadIndex = imageUrl.indexOf('/upload/') + '/upload/'.length;
  const transformation = 'c_fill,w_300,h_300,g_faces/';

  return `${imageUrl.slice(0, uploadIndex)}${transformation}${imageUrl.slice(uploadIndex)}`;
}

/**
 * 将 SVG 字符串编码并转为可直接用于 CSS background-image 的 URL 格式
 *
 * @param svg - 原始 SVG 字符串
 * @returns 返回格式化后的背景图片 URL，适用于 CSS background-image
 */
function createSVGBackground(svg: string): string {
  const encodedSVG = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
  return `url("data:image/svg+xml,${encodedSVG}")`;
}

export { transformImageUrl, createSVGBackground };
