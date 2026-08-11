import "server-only";
import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/** Upload a data URI (data:image/...;base64,....) and return the secure URL. */
export async function uploadImage(dataUri: string): Promise<string> {
  ensureConfigured();
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: "formaza11/products",
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return res.secure_url;
}
