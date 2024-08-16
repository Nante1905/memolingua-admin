import { toBase64 } from "../services/upload/fileUpload.service";

export const uploadFile = async (file: File) => {
  const fileData = await toBase64(file);
  return {
    preview: URL.createObjectURL(file),
    file: {
      fileName: file.name,
      blob: fileData,
      contentType: file.type,
    },
  };
};
