import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = async (
  buffer,
  folder = "placements",
  resourceType = "raw"
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};