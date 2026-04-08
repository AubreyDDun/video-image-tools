export async function compressImage(
  file: File,
  quality: number = 0.7,
  maxWidth: number = 1920,
  maxHeight: number = 1920
): Promise<{ blob: Blob; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      // 计算缩放比例
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        // 压缩并导出
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                size: blob.size,
              });
            } else {
              reject(new Error('压缩失败'));
            }
          },
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          quality
        );
      } else {
        reject(new Error('无法获取 canvas 上下文'));
      }
    };
    
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
}
