export interface ImageFile {
  base64: string;
  mimeType: string;
  dataUrl: string;
}

export const fileToImageFile = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
        return reject(new Error('File is not an image.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve({
        base64,
        mimeType: file.type,
        dataUrl,
      });
    };
    reader.onerror = (error) => reject(error);
  });
};
