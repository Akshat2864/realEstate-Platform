
import imagekit from "../config/imagekit.js";
import { toFile } from "@imagekit/nodejs";

export const uploadImage = async (file) => {
  const uploadedFile = await imagekit.files.upload({
    file: await toFile(file.buffer, file.originalname),
    fileName: `${Date.now()}-${file.originalname}`,
    folder: "/realestate/properties",
  });

  return {
    url: uploadedFile.url,
    fileId: uploadedFile.fileId,
  };
};

export const deleteImage = async (fileId) => {
  await imagekit.files.delete(fileId);
};
