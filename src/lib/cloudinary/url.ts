type ImageOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "limit" | "fit";
  gravity?: "auto";
};

export function getCloudinaryImageUrl(
  publicId: string,
  options: ImageOptions = {},
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";

  const transforms = ["f_auto", "q_auto"];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}
